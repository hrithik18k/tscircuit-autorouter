import { expect, test } from "bun:test"
import { AutoroutingPipelineSolver11_Simplification } from "lib/autorouter-pipelines/AutoroutingPipeline11_Simplification/AutoroutingPipelineSolver11_Simplification"
import type { SimpleRouteJson } from "lib/types"

test("via drill differences alone keep a trace unchanged", () => {
  const input: SimpleRouteJson = {
    layerCount: 2,
    minTraceWidth: 0.2,
    bounds: { minX: -1, minY: -1, maxX: 7, maxY: 1 },
    obstacles: [],
    connections: [
      {
        name: "signal",
        pointsToConnect: [
          { x: 0, y: 0, layer: "top" },
          { x: 6, y: 0, layer: "top" },
        ],
      },
    ],
    traces: [
      {
        type: "pcb_trace",
        pcb_trace_id: "trace1",
        connection_name: "signal",
        route: [
          { route_type: "wire", x: 0, y: 0, layer: "top", width: 0.2 },
          { route_type: "wire", x: 2, y: 0, layer: "top", width: 0.2 },
          {
            route_type: "via",
            x: 2,
            y: 0,
            from_layer: "top",
            to_layer: "bottom",
            via_diameter: 0.6,
            via_hole_diameter: 0.3,
          },
          { route_type: "wire", x: 2, y: 0, layer: "bottom", width: 0.2 },
          { route_type: "wire", x: 4, y: 0, layer: "bottom", width: 0.2 },
          {
            route_type: "via",
            x: 4,
            y: 0,
            from_layer: "bottom",
            to_layer: "top",
            via_diameter: 0.6,
            via_hole_diameter: 0.4,
          },
          { route_type: "wire", x: 4, y: 0, layer: "top", width: 0.2 },
          { route_type: "wire", x: 6, y: 0, layer: "top", width: 0.2 },
        ],
      },
    ],
  }
  const solver = new AutoroutingPipelineSolver11_Simplification(input)
  solver.solve()
  expect(solver.solved).toBe(true)
  expect(solver.failed).toBe(false)
  expect(solver.getOutputSimplifiedPcbTraces()[0]!.route).toEqual(
    input.traces![0]!.route,
  )
})
