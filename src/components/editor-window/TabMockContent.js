export const audioMock = `
<ps-dac>
  <ps-gain value="0.1">
    <ps-env-osc wav="squ" attack="0" sustain="0" release="40" trigger="a"></ps-env-osc>
  </ps-gain>
</ps-dac>
<ps-seq>
  <ps-pat-mod speed="0.5" degrade="0.5">
    <ps-pat-midi pattern="a:52 a:60 a:65 a:72"></ps-pat-midi>
    <ps-pat-midi pattern="a a a"></ps-pat-midi>
  </ps-pat-mod>
</ps-seq>`;

export const graphicsMock = `
<ps-viz-cone
  position="-10 -10 0"
  rotation="0 0 0"
  scale="1 1 1"
  color="0.5 0 0.8"
  pos-vel="0 0 0"
  rot-vel="1 0 0"
  scale-vel="0 0 0"
/>`;