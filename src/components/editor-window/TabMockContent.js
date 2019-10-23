export const audioMock = `
<h-dac>
  <h-gain value="0.1">
    <h-env-osc wav="squ" attack="0" sustain="0" release="40" trigger="a">
    </h-env-osc>
  </h-gain>
  <h-gain value="0.5">
    <h-sampler name="kick" attack="0" sustain="0" release="100" trigger="a">
    </h-sampler>
  </h-gain>
</h-dac>
<h-seq>
  <h-arp step="1" distance="12" rate="1" repeat="1">
    <h-pat-mod speed="1">
      <h-pat-midi pattern="a:52 a:60 a:65 a:72">
      </h-pat-midi>
      <h-pat-midi pattern="a a a">
      </h-pat-midi>
    </h-pat-mod>
  </h-arp>
</h-seq>`;

export const graphicsMock = `
<ps-viz-cone
  position="fn(10*sin(time)) -10 0"
  rotation="0 0 0"
  scale="1 1 1"
  color="0.5 0 0.8"
/>`;
