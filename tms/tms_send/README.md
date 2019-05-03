# Starting up the Spine MTH Server in the Testbench
1. From the home directory of your Testbench, open the following file: `$ITK_HOME/config/SPINE_MTH/tkw.properties` and uncomment line 68 and comment out line 69.

2. In tkw.properties, change the values on line 17 and 18 from No to Yes.

3. On line 22, replace the truststore with `$PRM_DEDUCTOR/tms/tls/trust.jks`.

4. On line 24, replace the truststore with `$PRM_DEDUCTOR/tms/tls/mth.jks`.

5. On lines 28 and 30, set the settings tks.tls.servermutualauthentication and tks.tls.clientmutualauthentication to *Yes*.

6. From `$ITK_HOME/config/SPINE_MTH/`, run `java -jar ../../TKW.jar -simulator tkw.properties`

# Setting up server to receive response
To receive asynchronous responses from the MTH server, start the server like so:

From `../tms_receive/`, start the server by typing `node main.js`.