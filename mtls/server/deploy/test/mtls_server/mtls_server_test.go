package mtls_server_test

import (
	"net/http"
	"strings"
	"testing"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
	"github.com/aws/aws-sdk-go/service/sts"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
	"fmt"
	"crypto/tls"
	"log"
	"crypto/x509"
	"github.com/gruntwork-io/terratest/modules/retry"
	"github.com/gruntwork-io/terratest/modules/random"
	"time"
)

func generateEnvironmentName() string {
	return "test-" + strings.ToLower(random.UniqueId())
}

func getAccountID(t *testing.T) string {
	sess, err := session.NewSession()
	if err != nil {
		t.Fatalf("unable to create aws sess: %v", err)
	}
	svc := sts.New(sess)
	out, err := svc.GetCallerIdentity(&sts.GetCallerIdentityInput{})
	if err != nil {
		t.Fatalf("unable to get caller identity: %v", err)
	}
	return *out.Account
}

func getSSMParameters(t *testing.T, name string) map[string]string {
	sess, err := session.NewSession()
	if err != nil {
		t.Fatalf("unable to create aws sess: %v", err)
	}
	svc := ssm.New(sess)
	withDecryption := true
	out, err := svc.GetParametersByPath(&ssm.GetParametersByPathInput{
		Path:           &name,
		WithDecryption: &withDecryption,
	})
	if err != nil {
		t.Fatalf("unable to get SSM parameters at path %s: %v", name, err)
	}

	result := make(map[string]string)

	for _, param := range out.Parameters {
		paths := strings.SplitAfter(*param.Name, "/")
		result[paths[len(paths) - 1]] = *param.Value
	}

	return result
}

func TestServerDeploy(t *testing.T) {
	// setup the  test fixture
	accountID := getAccountID(t)
	environmentName := generateEnvironmentName()

	// setup dependencies
	preSetupOptions := &terraform.Options{
		TerraformDir: "pre-setup",

		Vars: map[string]interface{}{
			"environment":        environmentName,
			"aws_region":         "eu-west-2",
			"availability_zones": []string{"eu-west-2a"},
		},

		BackendConfig: map[string]interface{}{
			"bucket": "prm-" + accountID + "-terraform-states",
			"key":    environmentName + "/terratest/mtls_server/pre-setup-terraform.tfstate",
			"region": "eu-west-2",
		},

		NoColor: true,
	}

	defer terraform.Destroy(t, preSetupOptions)
	terraform.InitAndApply(t, preSetupOptions)

	// deploy the lambda
	lambdaSetupOptions := &terraform.Options{
		TerraformDir: "../../../../lambda/deploy/src/mtls_test_lambda",

		Vars: map[string]interface{}{
			"environment": environmentName,
			"aws_region":  "eu-west-2",
			"lambda_zip":  "../../../../lambda/lambda/mtls_test/lambda.zip",
		},

		BackendConfig: map[string]interface{}{
			"bucket": "prm-" + accountID + "-terraform-states",
			"key":    environmentName + "/terratest/mtls_server/lambda-terraform.tfstate",
			"region": "eu-west-2",
		},

		NoColor: true,
	}

	defer terraform.Destroy(t, lambdaSetupOptions)
	terraform.InitAndApply(t, lambdaSetupOptions)

	// deploy the cluster
	clusterSetupOptions := &terraform.Options{
		TerraformDir: "../../src/cluster",

		Vars: map[string]interface{}{
			"environment": environmentName,
			"aws_region":  "eu-west-2",
		},

		BackendConfig: map[string]interface{}{
			"bucket": "prm-" + accountID + "-terraform-states",
			"key":    environmentName + "/terratest/mtls_server/cluster-terraform.tfstate",
			"region": "eu-west-2",
		},

		NoColor: true,
	}

	defer terraform.Destroy(t, clusterSetupOptions)
	terraform.InitAndApply(t, clusterSetupOptions)


	setupOptions := &terraform.Options{
		TerraformDir: "../../src/mtls_server",

		Vars: map[string]interface{}{
			"environment": environmentName,
			"aws_region":  "eu-west-2",
			"docker_tag":  "20190514151024",
		},

		BackendConfig: map[string]interface{}{
			"bucket": "prm-" + accountID + "-terraform-states",
			"key":    environmentName + "/terratest/mtls_server/terraform.tfstate",
			"region": "eu-west-2",
		},

		NoColor: true,
	}

	defer terraform.Destroy(t, setupOptions)
	terraform.InitAndApply(t, setupOptions)

	params := getSSMParameters(t, fmt.Sprintf("/prm/%s/mtls_server/%s", accountID, environmentName))

	url := terraform.Output(t, setupOptions, "mtls_server_url")

	cert, err := tls.X509KeyPair([]byte(params["client_cert"]), []byte(params["client_key"]))
	if err != nil {
		log.Fatalln("Unable to load cert", err)
	}

	roots := x509.NewCertPool()
	roots.AppendCertsFromPEM([]byte(params["ca"]))

	tlsConf := &tls.Config{
		Certificates: []tls.Certificate{cert},
		RootCAs: roots,
	}

	tr := &http.Transport{TLSClientConfig: tlsConf}
	client := &http.Client{Transport: tr}


	status, err := retry.DoWithRetryE(t, fmt.Sprintf("HTTP POST to URL %s", url), 3, 5 * time.Second, func() (string, error) {
		resp, err := client.Post(url, "test/plain", strings.NewReader(""))
		if err != nil {
			return "", err
		}
		return resp.Status, nil
	})


	assert.Equal(t, "202 Accepted", status)
}
