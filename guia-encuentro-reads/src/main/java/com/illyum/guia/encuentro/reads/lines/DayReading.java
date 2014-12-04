package com.illyum.guia.encuentro.reads.lines;

public class DayReading {
	private Header _header;
	private ReadingBody _readingBody;
	
	private DayReading(Builder builder) {
		_header = builder.header;
		_readingBody = builder.readingBody;
	}

	public String toHtml() {
		StringBuilder builder = new StringBuilder();
		builder.append(_header.toHtml());
		
		_readingBody.addEntry(BottomEntry.create());
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
		
		public DayReading build() {
			return new DayReading(this);
		}

		public Builder addHeaderLevelOne(String conten) {
			header.addEntry(EntryHeader.createLevelOneWithContent(conten));
			return this;
		}
		
		public Builder addHeaderLevelTwo(String conten) {
			header.addEntry(EntryHeader.createLevelTwoWithContent(conten));
			return this;
		}
		
		public Builder addHeaderLevelThree(String conten) {
			header.addEntry(EntryHeader.createLevelThreeWithContent(conten));
			return this;
		}

		public Builder addParagraph(Paragraph paragraph) {
			readingBody.addEntry(paragraph);
			return this;
		}

		public Builder addLine(String content) {
			readingBody.addEntry(EntryLine.createWithContent(content));
			return this;
		}

	}
}
