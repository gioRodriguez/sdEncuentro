package com.illyum.guia.encuentro.reads.lines;

import java.util.ArrayList;
import java.util.List;

public class Paragraph implements Entry {
	private List<Entry> _lines;
	
	private Paragraph() {
		_lines = new ArrayList<Entry>();
	}

	public static Paragraph create() {
		return new Paragraph();
	}

	public void addEntry(Entry entry) {
		_lines.add(entry);
	}

	@Override
	public String toHtml() {
		StringBuilder builder = new StringBuilder();
		for (Entry line : _lines) {
			builder.append(line.toHtml());
		}
		
		return String.format("<p class='paragraph'>%s</p>", builder.toString());
	}

	public void addLine(String content) {
		_lines.add(EntryLine.createWithContent(content));
	}

}
