angular.module('cemriApp')
        .service('cityLatLng', function () {
          var cityLatLng = this;
          cityLatLng.coordinates = {
              "Niger": {
                  "lat": 17.607789,
                  "lng": 8.081666
              },
              "Chad": {
                  "lat": 15.454166,
                  "lng": 18.732207
              },
              "Qatrun": {
                  "lat": 24.933333,
                  "lng": 14.633333
              },
              "Sabha": {
                  "lat": 27.0087129,
                  "lng": 14.4490398
              },
              "Niamey": {
                  "lat": 13.5115963,
                  "lng": 2.1253854
              },
              //"Zander": {},
              "Agades": {
                  "lat": 16.9741689,
                  "lng": 7.986535
              },
              "Arlit": {
                  "lat": 18.7390029,
                  "lng": 7.3894772
              },
              "Tamanrasset": {
                  "lat": 22.7888209,
                  "lng": 5.5258107
              },
              //"janet": {},
              //"Tawa": {},
              "Ouagadougou": {
                  "lat": 12.3714277,
                  "lng": -1.5196603
              },
              "Ghat": {
                  "lat": 24.9640371,
                  "lng": 10.1759285
              },
              "Ajdabiya": {
                  "lat": 30.214647,
                  "lng": 20.1402594
              },
              "Tanit": {
                  "lat": 36.7248028,
                  "lng": 10.2172181
              },
              "Keren": {
                  "lat": 15.7800173,
                  "lng": 38.45344610000001
              },
              "Kasala": {
                "lat": 15.462619,
                "lng": 36.403574
              },
              "Khartoum": {
                  "lat": 15.5006544,
                  "lng": 32.5598994
              },
              "dongola": {
                  "lat": 19.1461403,
                  "lng": 30.4703258
              },
              //"al-kofra": {},
              //"Kune": {},
              "Lome": {
                  "lat": 6.1724969,
                  "lng": 1.2313618
              },
              //"Kokno": {},
              "galkayo": {
                  "lat": 6.7872726,
                  "lng": 47.4392352
              },
              "dire dawa": {
                  "lat": 9.6008747,
                  "lng": 41.850142
              },
              //"mosawa": {},
              "kasla": {
                  "lat": 24.6856378,
                  "lng": 84.7655017
              },
              //"Bytadko": {},
              //"Elite": {},
              "Benghazi": {
                  "lat": 32.0947711,
                  "lng": 20.1879106
              },
              //"Kynambo": {},
              "Abuja": {
                  "lat": 9.0764785,
                  "lng": 7.398574
              },
              "Cairo": {
                  "lat": 30.0444196,
                  "lng": 31.2357116
              },
              "Tripoli": {
                  "lat": 32.8872094,
                  "lng": 13.1913383
              },
              "mogadishu": {
                  "lat": 2.0469343,
                  "lng": 45.3181623
              },
              "keren": {
                  "lat": 15.7800173,
                  "lng": 38.45344610000001
              },
              "khartoum": {
                  "lat": 15.5006544,
                  "lng": 32.5598994
              },
              "Barentu": {
                  "lat": 15.1074513,
                  "lng": 37.5907446
              },
              "Al Kufra": {
                  "lat": 23.3112389,
                  "lng": 21.8568586
              },
              "Beledweyne": {
                  "lat": 4.7429412,
                  "lng": 45.2009362
              },
              "Addis Ababa": {
                  "lat": 8.9806034,
                  "lng": 38.7577605
              },
              "Juba": {
                  "lat": 4.859363,
                  "lng": 31.57125
              },
              //"Rebiana": {},
              //"Merzak": {},
              //"Adjerat": {},
              //"Afera": {},
              "Bani Walid": {
                  "lat": 31.7975831,
                  "lng": 14.053676
              },
              "Tessenei": {
                  "lat": 15.0981366,
                  "lng": 36.6579649
              },
              "Dar'a": {
                  "lat": 32.9248813,
                  "lng": 36.1762615
              },
              "Amman": {
                  "lat": 31.9453666,
                  "lng": 35.9283716
              },
              //"Quileg": {},
              "Kassala": {
                  "lat": 15.4581332,
                  "lng": 36.4039629
              },
              "Damascus": {
                  "lat": 33.5138073,
                  "lng": 36.2765279
              },
              //"Tawy": {},
              //"Saqdam": {},
              "Kano": {
                  "lat": 12.0021794,
                  "lng": 8.591956099999999
              },
              //"Salom": {},
              "Sirte": {
                  "lat": 31.189689,
                  "lng": 16.5701927
              },
              "Algeria": {
                  "lat": 28.033886,
                  "lng": 1.659626
              },
              "Ubari": {
                  "lat": 26.5810176,
                  "lng": 12.7939759
              },
              "Istanbul": {
                  "lat": 41.0082376,
                  "lng": 28.9783589
              },
              "Aswan": {
                  "lat": 24.088938,
                  "lng": 32.8998293
              },
              //"Tiger": {},
              "Malakal": {
                  "lat": 9.5279875,
                  "lng": 31.6682347
              },
              "Al Qadarif": {
                  "lat": 14.024307,
                  "lng": 35.3685679
              },
              "Libya": {
                  "lat": 26.3351,
                  "lng": 17.228331
              },
              "Tsorona": {
                  "lat": 14.6242919,
                  "lng": 39.1985723
              },
              //"Jeera": {},
              "Dongola": {
                  "lat": 19.1461403,
                  "lng": 30.4703258
              },
              "Mendefera": {
                  "lat": 14.8725628,
                  "lng": 38.8100855
              },
              "Shira": {
                  "lat": 11.45301,
                  "lng": 10.05382
              },
              "Niyala": {
                  "lat": 12.0518011,
                  "lng": 24.8804853
              },
              "Al-Fashir": {
                  "lat": 13.6197501,
                  "lng": 25.3548713
              },
              "Omdurman": {
                  "lat": 15.6475782,
                  "lng": 32.4806894
              },
              //"Monee": {}
          };
        });
