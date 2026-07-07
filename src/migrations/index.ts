import * as migration_20260706_225219_add_topics from "./20260706_225219_add_topics";
import * as migration_20260707_160213_make_book_images_optional from "./20260707_160213_make_book_images_optional";
import * as migration_20260707_192740_add_book_metadata from "./20260707_192740_add_book_metadata";

export const migrations = [
  {
    up: migration_20260706_225219_add_topics.up,
    down: migration_20260706_225219_add_topics.down,
    name: "20260706_225219_add_topics",
  },
  {
    up: migration_20260707_160213_make_book_images_optional.up,
    down: migration_20260707_160213_make_book_images_optional.down,
    name: "20260707_160213_make_book_images_optional",
  },
  {
    up: migration_20260707_192740_add_book_metadata.up,
    down: migration_20260707_192740_add_book_metadata.down,
    name: "20260707_192740_add_book_metadata",
  },
];
