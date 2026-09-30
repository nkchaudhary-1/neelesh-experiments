/** Thrown for any authoring mistake. The message is written to be read in a build log. */
export class ContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentError'
  }
}
