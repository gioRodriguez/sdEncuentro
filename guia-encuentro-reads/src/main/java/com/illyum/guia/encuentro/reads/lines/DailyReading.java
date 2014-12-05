package com.illyum.guia.encuentro.reads.lines;


public class DailyReading {
	private Header _header;
	private ReadingBody _readingBody;	
	
	private DailyReading(Builder builder) {
		_header = builder.header;
		_readingBody = builder.readingBody;
	}

	public String toHtml() {
		StringBuilder builder = new StringBuilder();
		builder.append(_header.toHtml());
		builder.append(_readingBody.toHtml());
		return builder.toString();
	}

	public static class Builder {

		private Header header;
		private ReadingBody readingBody;
		
		public Builder() {
			header = Header.create();
			readingBody = ReadingBody.create();
		}
		
		public DailyReading build() {
			return new DailyReading(this);
		}

		public Builder addParagraph(Paragraph paragraph) {
			readingBody.addParagraph(paragraph);
			return this;
		}

		public Builder addLine(String lineContent) {	
			Paragraph paragraph = Paragraph.create();
			paragraph.addLine(lineContent);
			addParagraph(paragraph);
			return this;
		}
		
		public Builder addHeaderWithLevel(String textLine, int headerLevel) {
			header.addEntry(EntryHeader.createWithLevel(textLine, headerLevel));
			return this;
		}

		public Builder addHeaderLevelOne(String content) {
			return addHeaderWithLevel(content, 1);
		}
		
		public Builder addHeaderLevelTwo(String content) {
			return addHeaderWithLevel(content, 2);
		}
		
		public Builder addHeaderLevelThree(String content) {
			return addHeaderWithLevel(content, 3);
		}
	}

	public static DailyReading empty() {
		return new DailyReading.Builder().build();
	}
}
