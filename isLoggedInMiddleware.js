module.exports = function(req, res, next) {
  try {
    console.log(`Session check - Current Session ID: ${req.sessionID}, User ID: ${req.session.userId}`); // gpt_pilot_debugging_log
    // New log as requested
    console.log(`Session check upon dashboard access - Session ID: ${req.sessionID}, User ID: ${req.session.userId}`); // gpt_pilot_debugging_log
  } catch (error) {
    console.error('Error while logging session check:', error.message, error.stack); // gpt_pilot_debugging_log
  }
  
  if (!req.session.userId) {
    console.log('No user session found. Redirecting to login.');
    return res.status(401).send('Not authorized. Please login.');
  } else {
    console.log('User session found. Proceeding.');
    next();
  }
};
