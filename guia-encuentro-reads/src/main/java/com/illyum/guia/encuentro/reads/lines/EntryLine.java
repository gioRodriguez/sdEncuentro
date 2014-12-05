package com.illyum.guia.encuentro.reads.lines;

public class EntryLine implements Entry {

	private final String _textLine;
	
	private EntryLine(
		String textLine
	) {
		_textLine = textLine;
	}

	@Override
	public String toHtml() {
		return String.format("<span>%s</span>", _textLine);
	}

	public static EntryLine createWithContent(String content) {
		return new EntryLine(content);
	}
}
