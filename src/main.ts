import * as Tone from "tone";
import audioBufferToWav  from "audiobuffer-to-wav";

((appContainer: HTMLDivElement | null) => {
  if (!appContainer) {
    return;
  }


  const generateAudioFile = async (): Promise<Tone.ToneAudioBuffer> => {
    return new Promise<Tone.ToneAudioBuffer>(async (res) => {
      // const sampler = new Tone.Sampler({
      //   urls: {
      //     C4: "C4.mp3",
      //     "D#4": "Ds4.mp3",
      //     "F#4": "Fs4.mp3",
      //     A4: "A4.mp3",
      //   },
      //   release: 1,
      //   baseUrl: "https://tonejs.github.io/audio/salamander/",
      //   onload: () => {

      //   }
      // });

      let pianoSampler = await new Promise<Tone.Sampler>((res) => {
          const pianoSampler = new Tone.Sampler({
              urls: {
                  A1: "A1.mp3",
                  A2: "A2.mp3",
              },
              baseUrl: "https://tonejs.github.io/audio/salamander/",
              onload: () => {
                res(pianoSampler);
              }
          })
      });

      const a = await Tone.Offline(({ transport }) => {
        pianoSampler = pianoSampler.toDestination();
        transport.schedule((_time) => {
          pianoSampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
        }, 0);
        transport.start();
      }, 4);
      
      res(a);




    // return await Tone.Offline(async ({ transport }) => {
    //   // debugger

    //   // const player = new Tone.Player(
    //   //   "https://tonejs.github.io/audio/berklee/gong_1.mp3"
    //   // ).toDestination();
    //   Tone.loaded().then(() => {
    //     debugger;
    //     const osc = new Tone.Oscillator().toDestination();
    //     transport.schedule((_time) => {
    //       osc.start(1).stop(2);
    //       sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
    //     }, 0);
    //     // make sure to start the transport
    //     transport.start();
    //   });

    });
    
    // }, 4);
  };

  const download = (arrayBuffer: ArrayBuffer) => {
    const url = URL.createObjectURL(new Blob([arrayBuffer]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rendered_audio.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  };

  const btn = document.createElement("button");
  btn.innerText = "Generate";
  btn.addEventListener("click", async () => {
    const audioBuffer = await generateAudioFile();
    const waveFileArrayBuffer = audioBufferToWav(audioBuffer.get()!, {
      float32: true
    });
    download(waveFileArrayBuffer);
  });
  appContainer.appendChild(btn);
})(document.querySelector<HTMLDivElement>('#app')!)
