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
			readingBody.addParagraph(paragraph);
			return this;
		}

		public Builder addLine(String lineContent) {	
			Paragraph paragraph = Paragraph.create();
			paragraph.addLine(lineContent);
			addParagraph(paragraph);
			return this;
		}

		public Builder addHeaderByIndex(String textLine, int headerIndex) {
			if(headerIndex == 0){
				return addHeaderLevelOne(textLine);
			}
			
			if(headerIndex == 1){
				return addHeaderLevelTwo(textLine);
			}
			
			if(headerIndex == 2){
				return addHeaderLevelThree(textLine);
			}
			
			throw new AssertionError("Header level not specified");
		}

	}

	public static DailyReading empty() {
		return new DailyReading.Builder().build();
	}
}
