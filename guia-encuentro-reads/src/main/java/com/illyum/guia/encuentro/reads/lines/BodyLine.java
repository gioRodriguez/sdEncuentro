package com.illyum.guia.encuentro.reads.lines;

public class BodyLine extends Line {

	protected BodyLine(
			String lineBody,
			int lineIndex
		) {
		super(lineBody, lineIndex);
	}

	@Override
	public String toHtml() {
		return String.format("<p>%s</p>", getLineBody());
	}

}
