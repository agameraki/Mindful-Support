function isAuthenticated(req, res, next) {
    if (req.session && req.session.isLoggedIn) {
        return next();
    }
    res.redirect('/login?error=Please login to continue');
}

function isNotAuthenticated(req, res, next) {
    if (req.session && req.session.isLoggedIn) {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = {
    isAuthenticated,
    isNotAuthenticated
};