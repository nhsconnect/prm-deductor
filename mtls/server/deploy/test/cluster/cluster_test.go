package cluster_test

import (
	"io/ioutil"
	"path/filepath"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ecs"
	"github.com/aws/aws-sdk-go/service/sts"
	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

func generateEnvironmentName() string {
	return "test-" + random.UniqueId()
}

func getAccountID(t *testing.T) string {
	session, err := session.NewSession()
	if err != nil {
		t.Fatalf("unable to create aws session: %v", err)
	}
	svc := sts.New(session)
	out, err := svc.GetCallerIdentity(&sts.GetCallerIdentityInput{})
	if err != nil {
		t.Fatalf("unable to get caller identity: %v", err)
	}
	return *out.Account
}

func loadFile(t *testing.T, name string) []byte {
	path := filepath.Join("testdata", name) // relative path
	bytes, err := ioutil.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return bytes
}

func TestClusterDeploy(t *testing.T) {
	// setup the  test fixture
	accountID := getAccountID(t)
	environmentName := generateEnvironmentName()

	// deploy the cluster
	setupOptions := &terraform.Options{
		TerraformDir: "../../src/cluster",

		Vars: map[string]interface{}{
			"environment": environmentName,
			"aws_region":  "eu-west-2",
		},

		BackendConfig: map[string]interface{}{
			"bucket": "prm-" + accountID + "-terraform-states",
			"key":    environmentName + "/terratest/cluster/terraform.tfstate",
			"region": "eu-west-2",
		},

		NoColor: true,
	}

	defer terraform.Destroy(t, setupOptions)
	terraform.InitAndApply(t, setupOptions)

	config := &aws.Config{Region: aws.String("eu-west-2")}
	sess := session.Must(session.NewSession(config))
	client := ecs.New(sess)

	result, err := client.ListClusters(&ecs.ListClustersInput{})
	if err != nil {
		t.Fatal(err)
	}

	expectedClusterArn := terraform.Output(t, setupOptions, "cluster_arn")

	found := false
	for _, clusterArn := range result.ClusterArns {
		if *clusterArn == expectedClusterArn {
			found = true
			break
		}
	}

	assert.True(t, found)
}
