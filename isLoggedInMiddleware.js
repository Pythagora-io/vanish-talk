module.exports = function(req, res, next) {
  console.log(`Session check - Current Session ID: ${req.sessionID}, User ID: ${req.session.userId}`); // gpt_pilot_debugging_log
  console.log(`reset query parameter value: ${req.query.reset}`); // gpt_pilot_debugging_log to check the query param value

  if (!req.session || !req.session.userId) {
    console.log('No user session found. Redirecting to login.'); // gpt_pilot_debugging_log
    return res.status(401).send('Not authorized. Please login.');
  } else {
    console.log('User session found. Proceeding.'); // gpt_pilot_debugging_log
    if (req.query.reset === 'true') {
      console.log('Intercepted request for password reset, serving setNewPassword.html content.'); // gpt_pilot_debugging_log
      const fs = require('fs');
      const path = require('path');

      const filePath = path.join(__dirname, 'public', 'setNewPassword.html');
      fs.readFile(filePath, 'utf8', (err, page) => {
        if (err) {
          console.error(`Error reading setNewPassword.html: ${err.message}`, err.stack); // gpt_pilot_debugging_log
          res.status(500).send('An error occurred while processing your request.');
          return;
        }

        res.send(page); // Serve the page content without redirecting
      });
    } else {
      next();
    }
  }
};