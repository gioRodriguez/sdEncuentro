package com.illyum.guia.encuentro.reads.lines;

import com.google.common.base.Splitter;
import com.google.common.base.Strings;

public class GuiaEncuentroHeaderLine extends GuiaEncuentroLine {

	protected GuiaEncuentroHeaderLine(
			String lineBody,
			int lineIndex
	) {
		super(lineBody, lineIndex);
	}
	
	@Override
	public boolean isHeader() {
		return true;
	}	

	@Override
	public String toHtml() {
		return String.format("<li>%s</li>", toHeader(getLineBody()));
	}

	private String toHeader(String body){
		if(Strings.isNullOrEmpty(body)){
			return "";
		}
		
		Iterable<String> words = Splitter.on(" ").split(body.toLowerCase());
		StringBuilder headerBuilder = new StringBuilder();
		for (String word : words) {
			if(Strings.isNullOrEmpty(word)){
				continue;
			}
			
			char[] letters = word.toLowerCase().toCharArray();
			char firstLetterInUpper = word.toUpperCase().charAt(0);
			
			letters[0] = firstLetterInUpper;
			
			for (char letter : letters) {
				headerBuilder.append(letter);
			}
			headerBuilder.append(" ");
		}
		return headerBuilder.toString().trim();
	}
}
