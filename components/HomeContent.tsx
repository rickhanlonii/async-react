import { Suspense } from "react";
import SuspenseController from "./SuspenseController";
import ClientLevel from "./ClientLevel";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ServerLevel({
  level,
  ms,
  children,
}: {
  level: number;
  ms: number;
  children?: React.ReactNode;
}) {
  await sleep(ms);
  return (
    <div
      style={{
        padding: "12px 16px",
        borderLeft: `4px solid hsl(${level * 40}, 70%, 50%)`,
        background: `hsla(${level * 40}, 70%, 50%, 0.1)`,
      }}
    >
      <span style={{ color: "hsl(0, 80%, 50%)", fontWeight: "bold" }}>
        [Server]
      </span>{" "}
      Level {level} — {ms}ms
      {children}
    </div>
  );
}

function Fallback({
  level,
  ms,
  type,
}: {
  level: number;
  ms: number;
  type: "server" | "client";
}) {
  return (
    <p style={{ marginLeft: (level - 1) * 16, color: "#999" }}>
      Loading {type} level {level} ({ms}ms)...
    </p>
  );
}

const DELAYS = [200, 400, 600, 800, 1000, 1200, 1400, 1600];

export default function HomeContent() {
  return (
    <SuspenseController>
      <div style={{ padding: 16, fontFamily: "monospace" }}>
        <h2>Mixed Server/Client Suspense Demo</h2>
        <p style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>
          Odd levels = server components (red). Even levels = client components
          (blue).
          <br />
          Client level 6 re-suspends client level 2. Client level 8 re-suspends
          client level 4.
        </p>
        {/* Level 1 - Server */}
        <Suspense
          fallback={<Fallback level={1} ms={DELAYS[0]} type="server" />}
        >
          <Suspense fallback={null}>
            <Suspense fallback={null}>
              <ServerLevel level={1} ms={DELAYS[0]}>
                {/* Level 2 - Client */}
                <Suspense
                  fallback={<Fallback level={2} ms={DELAYS[1]} type="client" />}
                >
                  <Suspense fallback={null}>
                    <ClientLevel level={2} ms={DELAYS[1]}>
                      {/* Level 3 - Server */}
                      <Suspense
                        fallback={
                          <Fallback level={3} ms={DELAYS[2]} type="server" />
                        }
                      >
                        <Suspense fallback={null}>
                          <Suspense fallback={null}>
                            <Suspense fallback={null}>
                              <ServerLevel level={3} ms={DELAYS[2]}>
                                {/* Level 4 - Client */}
                                <Suspense
                                  fallback={
                                    <Fallback
                                      level={4}
                                      ms={DELAYS[3]}
                                      type="client"
                                    />
                                  }
                                >
                                  <Suspense fallback={null}>
                                    <ClientLevel level={4} ms={DELAYS[3]}>
                                      {/* Level 5 - Server */}
                                      <Suspense
                                        fallback={
                                          <Fallback
                                            level={5}
                                            ms={DELAYS[4]}
                                            type="server"
                                          />
                                        }
                                      >
                                        <Suspense fallback={null}>
                                          <ServerLevel level={5} ms={DELAYS[4]}>
                                            {/* Level 6 - Client */}
                                            <Suspense
                                              fallback={
                                                <Fallback
                                                  level={6}
                                                  ms={DELAYS[5]}
                                                  type="client"
                                                />
                                              }
                                            >
                                              <Suspense fallback={null}>
                                                <Suspense fallback={null}>
                                                  <ClientLevel
                                                    level={6}
                                                    ms={DELAYS[5]}
                                                  >
                                                    {/* Level 7 - Server */}
                                                    <Suspense
                                                      fallback={
                                                        <Fallback
                                                          level={7}
                                                          ms={DELAYS[6]}
                                                          type="server"
                                                        />
                                                      }
                                                    >
                                                      <Suspense
                                                        fallback={null}
                                                      >
                                                        <ServerLevel
                                                          level={7}
                                                          ms={DELAYS[6]}
                                                        >
                                                          {/* Level 8 - Client */}
                                                          <Suspense
                                                            fallback={
                                                              <Fallback
                                                                level={8}
                                                                ms={DELAYS[7]}
                                                                type="client"
                                                              />
                                                            }
                                                          >
                                                            <Suspense
                                                              fallback={null}
                                                            >
                                                              <Suspense
                                                                fallback={null}
                                                              >
                                                                <Suspense
                                                                  fallback={
                                                                    null
                                                                  }
                                                                >
                                                                  <ClientLevel
                                                                    level={8}
                                                                    ms={
                                                                      DELAYS[7]
                                                                    }
                                                                  />
                                                                </Suspense>
                                                              </Suspense>
                                                            </Suspense>
                                                          </Suspense>
                                                        </ServerLevel>
                                                      </Suspense>
                                                    </Suspense>
                                                  </ClientLevel>
                                                </Suspense>
                                              </Suspense>
                                            </Suspense>
                                          </ServerLevel>
                                        </Suspense>
                                      </Suspense>
                                    </ClientLevel>
                                  </Suspense>
                                </Suspense>
                              </ServerLevel>
                            </Suspense>
                          </Suspense>
                        </Suspense>
                      </Suspense>
                    </ClientLevel>
                  </Suspense>
                </Suspense>
              </ServerLevel>
            </Suspense>
          </Suspense>
        </Suspense>
      </div>
    </SuspenseController>
  );
}
