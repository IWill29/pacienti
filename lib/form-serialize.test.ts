import { describe, expect, it } from "vitest";

import { serializePirmreizejaisPacients } from "@/lib/form-serialize";
import { emptyPirmreizejaisPacients } from "@/lib/types/forms";

describe("serializePirmreizejaisPacients", () => {
  it("includes filled anamnesis fields and piezimes", () => {
    const data = {
      ...emptyPirmreizejaisPacients(),
      dzemdibasVeids: "dabigas" as const,
      sarezgijumiDzemdibas: "ne" as const,
      galvasTraumas: "pirms 13 gadiem pēc kritiena",
      piezimes: {
        ...emptyPirmreizejaisPacients().piezimes,
        dzemdibasVeids: "bez komplikācijām",
      },
    };

    const serialized = serializePirmreizejaisPacients(data);

    expect(serialized).toContain("DABĪGAS");
    expect(serialized).toContain("pirms 13 gadiem");
    expect(serialized).toContain("bez komplikācijām");
  });
});
