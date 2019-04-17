/* ignore file coverage: just a config file */
module.exports = () => {
    return {
      loose: true,
      files: [
        'src/*.js', 
        'test/*.js', 
        '!test/*.spec.js'
      ],
      tests: [
        'test/*.spec.js'
        ],
      hints: {
        ignoreCoverageForFile: /ignore file coverage/,
        ignoreCoverage: /ignore coverage/
      },
      env: {
        type: 'node',
        runner: 'node'
      },
  
      testFramework: 'jest'
    };
  };
  