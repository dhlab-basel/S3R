import { TestBed, inject } from "@angular/core/testing";

import { ArkService } from "./ark.service";

describe("ArkService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArkService]
    });
  });

  it("should be created", inject([ArkService], (service: ArkService) => {
    expect(service).toBeTruthy();
  }));
});
