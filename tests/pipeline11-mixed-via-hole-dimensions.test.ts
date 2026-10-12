import { expect, test } from "bun:test"
import { ApplyTraceSimplificationSolver } from "lib/autorouter-pipelines/AutoroutingPipeline11_Simplification/ApplyTraceSimplificationSolver"
import { PrepareTraceSimplificationSolver } from "lib/autorouter-pipelines/AutoroutingPipeline11_Simplification/PrepareTraceSimplificationSolver"
import type { SimpleRouteJson } from "lib/types"

test("via drill differences alone keep a trace unchanged", () => {
  const input: SimpleRouteJson = {
    layerCount: 2,
    minTraceWidth: 0.2,
    bounds: { minX: -1, minY: -1, maxX: 7, maxY: 1 },
    obstacles: [],
    connections: [{ name: "signal", pointsToConnect: [
      { x: 0, y: 0, layer: "top" },
      { x: 6, y: 0, layer: "top" },
    ] }],
    traces: [{ type: "pcb_trace", pcb_trace_id: "trace1", connection_name: "signal", route: [
      { route_type: "wire", x: 0, y: 0, layer: "top", width: 0.2 },
      { route_type: "wire", x: 2, y: 0, layer: "top", width: 0.2 },
      { route_type: "via", x: 2, y: 0, from_layer: "top", to_layer: "bottom", via_diameter: 0.6, via_hole_diameter: 0.3 },
      { route_type: "wire", x: 2, y: 0, layer: "bottom", width: 0.2 },
      { route_type: "wire", x: 4, y: 0, layer: "bottom", width: 0.2 },
      { route_type: "via", x: 4, y: 0, from_layer: "bottom", to_layer: "top", via_diameter: 0.6, via_hole_diameter: 0.4 },
      { route_type: "wire", x: 4, y: 0, layer: "top", width: 0.2 },
      { route_type: "wire", x: 6, y: 0, layer: "top", width: 0.2 },
    ] }],
  }
  const prepare = new PrepareTraceSimplificationSolver({ inputSrj: input, options: {} })
  prepare.solve()
  const preparedInput = prepare.getOutput()
  expect(preparedInput.mutableHdRoutes).toHaveLength(0)
  const apply = new ApplyTraceSimplificationSolver({
    preparedInput,
    simplifiedHdRoutes: preparedInput.mutableHdRoutes,
  })
  apply.solve()
  expect(apply.getOutput().traces?.[0]?.route).toEqual(input.traces?.[0]?.route)
})
