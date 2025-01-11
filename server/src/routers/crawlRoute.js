const express = require('express');
const { crawlByURL } = require('../controllers/crawlController');

const router = express.Router();


const data = {
    "appId": "252490",
    "title": "Rust",
    "type": "Game",
    "price": null,
    "discount": null,
    "discountStartDate": 1736549924776,
    "discountEndDate": "null 2025",
    "description": "The only aim in Rust is to survive. Everything wants you to die - the island’s wildlife, other inhabitants, the environment, and other survivors. Do whatever it takes to last another night.",
    "releaseDate": "Feb 8, 2018",
    "developer": [
        "Facepunch Studios"
    ],
    "publisher": [
        "Facepunch Studios"
    ],
    "platform": [
        "Windows"
    ],
    "tags": [
        "Survival",
        "Crafting",
        "Multiplayer",
        "Open World",
        "Open World Survival Craft",
        "Building",
        "PvP",
        "Sandbox",
        "Adventure",
        "First-Person",
        "Action",
        "Nudity",
        "FPS",
        "Shooter",
        "Co-op",
        "Online Co-Op",
        "Indie",
        "Post-apocalyptic",
        "Early Access",
        "Simulation"
    ],
    "genres": [
        "Action",
        "Adventure",
        "Indie",
        "Massively Multiplayer",
        "RPG"
    ],
    "features": [
        "MMO",
        "Online PvP",
        "Online Co-op",
        "Cross-Platform Multiplayer",
        "Steam Achievements",
        "Steam Trading Cards",
        "Steam Workshop",
        "In-App Purchases",
        "Stats",
        "Remote Play on Tablet"
    ],
    "headerImage": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg?t=1736449001",
    "screenshots": [
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_271feae67943bdc141c1249aba116349397e9ba9.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_e825b087b95e51c3534383cfd75ad6e8038147c3.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_0e646f1a70e5cb8eed00efef8adb9579d40d5b2e.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_1c2d0d1eefee54f0c67626c74eb21699bbb0ef52.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_d0fdacaeef5a28a7cee525fd73376adfe083c964.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_827f1bb38361eb3f7de91cff9be5b7176a05a9ac.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_bbf6c96e490326ec877ae548cb148e53516b5f83.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_2a8518810024a5fbf9c714e697a43a1201b5d53e.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_c88939db635d959b25eb1bcf9b4c4dcdec04b3fe.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_eafe26f0577f9fc25d7a89884ea6f40381973c8a.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_9652dbaf2de41b8c8f8305af714ee258564c453d.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_9d2ad1cd00376605d6f9a778eb7bd1cddfd68ee1.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_803a18bcbf6004706f12a1f88bb3cadbd9ac5f5b.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_aaa718a3cb0696a816456283526842c4f2d6b1bc.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_24483e657f7e59d74e4914f79c51d9c821454e98.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_dd5a5bf9a19b8b8a078dfdae8b7e09c0e78d2b4d.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_651097c65458ae555b42c42dd9667d7174397bdf.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_40bde646d6ed6ebda0d7f42f52d66d147935bbfa.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_21afaa3e6697adbb9173e0266c9de913a5a05457.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_9264a17b6bc1b3f9df55cf2aafcc25c6188bba59.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_69b259a1ab43e2e12f119ecb6b48117a7ff0b216.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_2166031b7e6eaedae3dfd8966421c6c4703b89ef.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_6c6269c7c6164876585e0728742156b49af966af.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_3834344f4f347f133a70096113d71ab3c5a7d587.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_f05168330593f4f476cd4a6a6094b248c7c8556e.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_a63f203245f322f28cf489bf46beaeec780cccec.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_521614c60fd57b8dc0c025848cdc5d03e8ccc714.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_326282c7485e8aff1ebf6750c82622afef098998.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_9dfb2cb3e93ab37ff47c7b2e011b1b9e42351107.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_08a111660a92c33c10d62e74620d258c216fd0bb.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_b5925cc5fad7a69486c570e3f912130ae0989f06.1920x1080.jpg?t=1736449001",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/ss_234b12804c91c911e4095fcb872ef7f1a1371ca2.1920x1080.jpg?t=1736449001"
    ],
    "videos": [
        {
            "thumbnail": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256684736/movie.293x165.jpg?t=1699598112",
            "mp4": "https://video.fastly.steamstatic.com/store_trailers/256684736/movie480.mp4?t=1699598112",
            "webm": "https://video.fastly.steamstatic.com/store_trailers/256684736/movie480_vp9.webm?t=1699598112"
        },
        {
            "thumbnail": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256761600/movie.293x165.jpg?t=1699598120",
            "mp4": "https://video.fastly.steamstatic.com/store_trailers/256761600/movie480.mp4?t=1699598120",
            "webm": "https://video.fastly.steamstatic.com/store_trailers/256761600/movie480.webm?t=1699598120"
        },
        {
            "thumbnail": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256761603/movie.293x165.jpg?t=1699598125",
            "mp4": "https://video.fastly.steamstatic.com/store_trailers/256761603/movie480.mp4?t=1699598125",
            "webm": "https://video.fastly.steamstatic.com/store_trailers/256761603/movie480.webm?t=1699598125"
        },
        {
            "thumbnail": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/256791647/20493083c046e6a02ba9af308eb683872764af34/movie_600x337.jpg?t=1736337052",
            "mp4": "https://video.fastly.steamstatic.com/store_trailers/256791647/movie480.mp4?t=1736337052",
            "webm": "https://video.fastly.steamstatic.com/store_trailers/256791647/movie480_vp9.webm?t=1736337052"
        }
    ],
    "systemRequirements": {
        "win": [
            {
                "title": "OS",
                "minimum": "Windows 10 64bit",
                "recommended": "Windows 11 64bit"
            },
            {
                "title": "Processor",
                "minimum": "Intel Core i5-8250U / AMD Ryzen 5 5500 or better",
                "recommended": "Intel Core i7-4790K / AMD Ryzen 5 2600 or better"
            },
            {
                "title": "Memory",
                "minimum": "10 GB RAM",
                "recommended": "16 GB RAM"
            },
            {
                "title": "Graphics",
                "minimum": "GTX 1050 / AMD 500 Series or better",
                "recommended": "RTX 3060 / RX 570 Series or better"
            },
            {
                "title": "DirectX",
                "minimum": "Version 11",
                "recommended": "Version 12"
            },
            {
                "title": "Storage",
                "minimum": "Broadband Internet connection",
                "recommended": "Broadband Internet connection"
            },
            {
                "title": "Sound Card",
                "minimum": "40 GB available space",
                "recommended": "40 GB available space"
            },
            {
                "title": "Additional Notes",
                "minimum": "SSD is highly recommended or expect longer than average load times.",
                "recommended": "SSD Required"
            }
        ],
        "mac": [
            {
                "title": "OS",
                "minimum": "Apple M1",
                "recommended": "Apple M1 Pro / Max / Ultra"
            },
            {
                "title": "Processor",
                "minimum": "10 GB RAM",
                "recommended": "16 GB RAM"
            },
            {
                "title": "Memory",
                "minimum": "AMD R9 Fury / Apple M1 / GTX 980",
                "recommended": "Apple M1 Pro / Max / Ultra / RTX 3060"
            },
            {
                "title": "Graphics",
                "minimum": "Broadband Internet connection",
                "recommended": "Broadband Internet connection"
            },
            {
                "title": "DirectX",
                "minimum": "40 GB available space",
                "recommended": "40 GB available space"
            },
            {
                "title": "Storage",
                "minimum": "",
                "recommended": "SSD is highly recommended or expect longer than average load times."
            },
            {
                "title": "Sound Card",
                "minimum": "",
                "recommended": ""
            },
            {
                "title": "Additional Notes",
                "minimum": "",
                "recommended": ""
            }
        ]
    }
}

router.get('/', crawlByURL);

// router.get('/', (req, res) => {
//     res.json(data);
// });

module.exports = router;