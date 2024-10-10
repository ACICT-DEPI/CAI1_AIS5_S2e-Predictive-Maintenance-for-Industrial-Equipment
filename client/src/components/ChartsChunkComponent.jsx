import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

export default function ChartsChunkComponent({
  changeHandler,
  marks,
  selectedChunk,
  chunkCount,
}) {
  return (
    <div className="charts-ctrls-container">
      {chunkCount > 1 && (
        <>
          <Typography gutterBottom style={{ marginTop: 20, marginBottom: 0 }}>
            Select Chunk:
          </Typography>
          <Slider
            aria-label="Custom marks"
            value={selectedChunk}
            step={1}
            min={0}
            max={chunkCount - 1}
            valueLabelDisplay="auto"
            marks={marks}
            sx={{
              "& .MuiSlider-markLabel": {
                color: "grey",
              },
            }}
            onChange={changeHandler}
          />
        </>
      )}
    </div>
  );
}
