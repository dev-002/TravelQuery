const baseURL = "http://192.168.1.35:5000/api/v1";
// const baseURL = "https://travelquery-api.onrender.com/api/v1";

export default {
  Auth: {
    register: baseURL + "/auth/register", // post
    login: baseURL + "/auth/login", // post
    logout: baseURL + "/auth/logout",
    sendOTP: baseURL + "/auth/forget", // post
    verifyOTP: baseURL + "/auth/verify", // post
    changePass: baseURL + "/auth/change", // post
  },
  Place: {
    fetchPlace: baseURL + "/places", // :id
    addPlace: baseURL + "/places/add", // post
    updatePlace: baseURL + "/places", // :id put
    removePlace: baseURL + "/places", // :id delete
    searchPlace: baseURL + "/places/search", // post

    addReview: baseURL + "/places/review/add", // post
    fetchReview: baseURL + "/places/review", // get :id
  },
  User: {
    getAllUsers: baseURL + "/users",
    getSpecificUser: baseURL + "/users", // post
    updateUser: baseURL + "/users", // :id put
    removeUser: baseURL + "/users", // :id delete
  },
  TravelPlan: {
    getAllTravelPlan: baseURL + "/travel-plans",
    getSpecificTravelPlan: baseURL + "/travel-plans", // :id
    addTravelPlan: baseURL + "/travel-plans/add", // post
    updateTravelPlan: baseURL + "/travel-plans/update", // :id put
    removeTravelPlan: baseURL + "/travel-plans/delete", // :id delete

    serachMember: baseURL + "/travel-plans/search/member", // post
    serachPlaces: baseURL + "/travel-plans/search/places", // post
    serachGuide: baseURL + "/travel-plans/search/guide", // post
  },
  Guide: {
    getAllTourGuide: baseURL + "/guide",
    getSpecificTourGuide: baseURL + "/guide", // :id post
    updateTourGuide: baseURL + "/guide", // :id put
    removeTourGuide: baseURL + "/guide", // :id delete

    fetchGuideArea: baseURL + "/guide/area",
    fetchTravelPlans: baseURL + "/guide/travelPlan",
    fetchReviews: baseURL + "/guide/reviews",

    fetchGuidesReview: baseURL + "/guide/reviews/guide", //post
    postReview: baseURL + "/guide/reviews", // post

    searchGuide: baseURL + "/guide/search", // post

    // Guide Screens
    quoteGen: baseURL + "/guide/screen/quote", // get
  },
  Profile: {
    getProfile: baseURL + "/profile", // :id
    updateProfile: baseURL + "/profile", // :id put
    fetchWishlist: baseURL + "/profile/wishlist",
    addWishlist: baseURL + "/profile/wishlist", // :id post
    checkWishlist: baseURL + "/profile/wishlist/check",
  },
};
