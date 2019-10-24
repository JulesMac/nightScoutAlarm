

declare module 'play-sound'{

    function createPlayer(opts: any): Player;
    interface Player {
        play(what: string, options: any, next: (err : any) => boolean) : void
        new(opt: string): string
    }
    export = createPlayer;
 }
