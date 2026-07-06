import * as migration_20260706_225219_add_topics from "./20260706_225219_add_topics";

export const migrations = [
  {
    up: migration_20260706_225219_add_topics.up,
    down: migration_20260706_225219_add_topics.down,
    name: "20260706_225219_add_topics",
  },
];
