console.log("Loaded!")

// Spotify 
module.exports.spotify = {
    id: process.env.spotify_key,
    secret: process.env.spotify_secret
}

// Bands in Town
module.exports.Bands = {
    id: process.env.bit_key
}

// OMDB
module.exports.Movies = {
    id: process.env.omdb_key
}