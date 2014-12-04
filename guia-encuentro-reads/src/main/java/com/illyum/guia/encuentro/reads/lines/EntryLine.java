package com.illyum.guia.encuentro.reads.lines;

public class EntryLine extends AbstractLine implements Entry {

	protected EntryLine(
			String lineBody,
			int lineIndex
		) {
		super(lineBody, lineIndex);
	}

	@Override
	public String toHtml() {
		return String.format("<p>%s</p>", getLineBody());
	}

	public static EntryLine createWithContent(String content) {
		return new EntryLine(content, 0);
	}

	@Override
	public void addEntry(Entry entry) {
		throw new AssertionError("this must not have other entries");
	}
}
