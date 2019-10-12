export const audioMock = `
<ps-dac>
  <ps-gain value="0.1">
    <ps-env-osc wav="squ" attack="0" sustain="0" release="40" trigger="a">
    </ps-env-osc>
  </ps-gain>
  <ps-gain value="0.5">
    <ps-sampler name="kick" attack="0" sustain="0" release="100" trigger="a">
    </ps-sampler>
  </ps-gain>
</ps-dac>
<ps-seq>
  <ps-arp step="1" distance="12" rate="1" repeat="1">
    <ps-pat-mod speed="1">
      <ps-pat-midi pattern="a:52 a:60 a:65 a:72">
      </ps-pat-midi>
      <ps-pat-midi pattern="a a a">
      </ps-pat-midi>
    </ps-pat-mod>
  </ps-arp>
</ps-seq>`;

export const graphicsMock = `
<ps-viz-cone
  position="fn(10*sin(time)) -10 0"
  rotation="0 0 0"
  scale="1 1 1"
  color="0.5 0 0.8"
/>`;
