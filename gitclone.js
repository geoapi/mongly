var Clone = require("nodegit");

// Clone a given repository into a tmp folder.
Clone("git://github.com/shower/jekyller", "tmp").then(function(repo) {
  // Use a known commit sha from this repository.
  var sha = "92ab80651509a738a7380154cb77f27befc176b4";

  // Look up this known commit.
  repo.getCommit(sha).then(function(commit) {
    // Look up a specific file within that commit.
    commit.getEntry("README.md").then(function(entry) {
      // Get the blob contents from the file.
      entry.getBlob().then(function(blob) {
        // Show the name, sha, and filesize in byes.
        console.log(entry.filename(), entry.sha(), blob.rawsize());

        // Show a spacer.
        console.log(Array(72).join("=") + "\n\n");

        // Show the entire file.
        console.log(String(blob));
      });
    });
  });
});
