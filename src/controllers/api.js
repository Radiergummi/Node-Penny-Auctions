var api = module.exports = {};
api.auctions = {};
api.store = {};
api.users = {};

/**
 * Auction Controllers
 */
api.auctions.getAuctionById = function(req, res, next) {
  res.json({
    auction: req.params.auctionid,
    data: {
      name: 'Test-Artikel 25',
      created: '20151210'
    }
  })
};

api.auctions.getAuctions = function(req, res, next) {

};

api.auctions.getBid = function(req, res, next) {

};

api.auctions.placeBid = function(req, res, next) {

};


/**
 * Store actions
 */
api.store.getItems = function(req, res, next) {

};

api.store.getItemById = function(req, res, next) {

};

api.store.getCategoryById = function(req, res, next) {

};

api.store.getCategories = function(req, res, next) {

};

api.store.getCategoryBySlug = function(req, res, next) {

};

api.store.searchItem = function(req, res, next) {

};

api.store.voteItem = function(req, res, next) {

};


/**
 * User actions
 */
api.users.getUsers = function(req, res, next) {

};

api.users.getUserProfile = function(req, res, next) {

};

api.users.editUserProfile = function(req, res, next) {

};

api.users.editUserSettings = function(req, res, next) {

};
