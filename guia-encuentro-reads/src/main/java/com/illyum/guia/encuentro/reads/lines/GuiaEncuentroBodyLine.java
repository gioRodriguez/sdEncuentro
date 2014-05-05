package com.illyum.guia.encuentro.reads.lines;

public class GuiaEncuentroBodyLine extends GuiaEncuentroLine {

	protected GuiaEncuentroBodyLine(
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
