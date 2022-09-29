import { sanitize_path } from "helpers/FileManagement";

const samples = [
  { input: "some text", output: "some text" },
  { input: ".some text", output: "some text" },
  { input: '*"/<>:|?', output: "-" },
  { input: "#^[]|", output: "-" },
  {
    input: '.some*"/tex<>:t|?',
    output: "some-tex-t",
  },
  {
    input: "so#^m[]e text|",
    output: "so-m-e text",
  },
];

describe("test sanitize_path helper", () => {
  for (const sample of samples) {
    it(`should sanitize ${sample.input} to ${sample.output}`, () => {
      expect(
        sanitize_path(sample.input, "-"),
      ).toBe(sample.output);
    });
  }
});
