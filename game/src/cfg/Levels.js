export const Levels = [
    {
        id: 1,
        tag: "slowSpacey",
        name: "Easy: Slow Spacey",
        bpm: 101,
        introBeats: 3,
        durationBeats: 34,
        hitsBeats: [
            0, 2,
            4, 6, 7.5,
            8, 10, 11.5,
            12, 14, 15.5,
            16, 18,
            20, 22,
            24, 26, 27.5,
            28, 30, 31.5,
            32,
        ],
        pulse: {
            enabled: true,
            subdivision: 4,
            amplitude: 0.5
        },
    },
    {
        id: 2,
        tag: "funkDisco",
        name: "Medium: Funk disco",
        bpm: 120,
        introBeats: 3,
        durationBeats: 40,
        hitsBeats: [
            0, 1, 2, 2.5, 3,
            4, 5,
            8, 9,
            12, 12.5, 13,
            16, 17, 18, 18.5,
            20, 21, 22,
            24, 25, 26, 26.5,
            28,
            32, 33, 34, 34.5,
            36, 37,

        ],
        pulse: {
            enabled: true,
            subdivision: 2,
            amplitude: 0.5
        },
    },
    {
        id: 3,
        tag: "rockIsh",
        name: "High: Rock ish",
        bpm: 120,
        introBeats: 3,
        durationBeats: 40,
        hitsBeats: [
            0, 0.5, 1, 1.5, 2.5, 3,
            4, 4.5, 5.5, 6.5,
            8, 8.5, 9.5, 10.5, 11,
            12, 12.75, 13,
            16, 16.5, 17.5, 18.5,
            20, 20.5, 21.5, 22.5, 23,
            24, 24.5, 25, 25.5, 26.5, 27,
            28, 28.75, 29, 29.5,
            32, 32.5, 33.5, 34.5,
            36, 36.5, 37, 37.5, 38.5, 39

        ],
        pulse: {
            enabled: true,
            subdivision: 1,
            amplitude: 0.5
        },
    },
];
