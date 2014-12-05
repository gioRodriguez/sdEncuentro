package com.illyum.guia.encuentro.reads.lines;

import java.util.ArrayList;
import java.util.List;

public class ReadingBody {
	private static final String FINAL_LINE_BODY = "<p><br><br></p>";
	
	private List<Entry> _entries;
	
	private ReadingBody() {
		_entries = new ArrayList<Entry>();
	}
	
	public static ReadingBody create() {
		return new ReadingBody();
	}

	public String toHtml() {
		StringBuilder builder = new StringBuilder();
		for (Entry entry : _entries) {
			builder.append(entry.toHtml());
		}
		
		builder.append(FINAL_LINE_BODY);
		
		return String.format("<div class='readBoby'>%s</div>", builder.toString());
	}
	
	public void addParagraph(Paragraph paragraph) {
		_entries.add(paragraph);
	}
	
	public void addLine(String lineContent) {
		Paragraph paragraph = Paragraph.create();
		paragraph.addLine(lineContent);		
		addParagraph(paragraph);
	}
}
