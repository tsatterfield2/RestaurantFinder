export class Review {
  public authorName: string;
  public rating: number;
  public timeDesc: string;
  public content: string;

  constructor(
    authorName: string,
    rating: number,
    timeDesc: string,
    content: string
  ) {
    this.authorName = authorName;
    this.rating = rating;
    this.timeDesc = timeDesc;
    this.content = content;
  }
}
