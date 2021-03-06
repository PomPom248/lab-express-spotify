const express = require("express");
const app = express();
const hbs = require("hbs")
const path = require("path");
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }))

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });

app.set("view engine", "hbs");
app.set("views", __dirname + "/views")
app.use(express.static(path.join(__dirname, "public")))

hbs.registerPartials(__dirname + "/views/partials")

app.get("/", (req, res, next) => {
    res.render("home")
})

app.post("/artists", (req, res, next) => {
    // console.log(req.body.artist)
    spotifyApi.searchArtists(req.body.artist)
        .then(data => {
            var artists = data.body.artists.items;
            console.log(data.body.artists)
            res.status(200).render("artists", { artists })
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
            // ----> 'HERE WE CAPTURE THE ERROR'
        })
})

app.get("/albums/:artistsId", (req, res, next) => {
    // console.log(req.params.artistsId)
    spotifyApi.getArtistAlbums(req.params.artistsId).then(
        function (data) {
            var albums = data.body.items;

            // console.log(albums);
            res.status(200).render("albums", { albums })
        },
        function (err) {
            console.error(err);
        }
    )
});

app.get("/tracks/:albumsId", (req, res, next) => {
    console.log(req.params.albumsId)
    spotifyApi.getAlbumTracks(req.params.albumsId).then(
        function (data) {
            var tracks = data.body.items;

            console.log(tracks);
            res.status(200).render("tracks", { tracks })
        },
        function (err) {
            console.error(err);
        }
    )
});

app.listen(3000)
