const Audio = {
    shoot: new Howl(
        {
            src: "./sounds/Basic_shoot_noise.wav",
            volume: 0.1
        }),
    mg_shoot: new Howl(
        {
            src: "./sounds/Basic_shoot_noise.wav",
            volume: 0.1
        }),
    damageTaken: new Howl(
        {
            src: "./sounds/Damage_taken.wav",
            volume: 0.1
        }),
    explode: new Howl(
        {
            src: "./sounds/Missle_or_rpg_or_something_that_shoots_an_explosive.wav",
            volume: 0.1
        }),
    death: new Howl(
        {
            src: "./sounds/Death.wav",
            volume: 0.1
        }),
    powerupNoise: new Howl(
        {
            src: "./sounds/Powerup_noise.wav",
            volume: 0.1
        }),
    select: new Howl(
        {
            src: "./sounds/Select.wav",
            volume: 0.1
        }),
    background: new Howl(
        {
            src: "./sounds/Hyper.wav",
            volume: 0.1,
            loop: true
        })
};

export default Audio;