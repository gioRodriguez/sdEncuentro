package com.illyum.guia.encuentro.reads.lines;

import java.util.HashSet;
import java.util.Set;

import com.google.common.base.Splitter;
import com.google.common.base.Strings;

public class GuiaEncuentroHeaderLine extends GuiaEncuentroLine {
	
	private static final Set<String> NOT_UPPER_WORDS = new HashSet<String>();
	static {
		NOT_UPPER_WORDS.add("del");
		NOT_UPPER_WORDS.add("de");
	}

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
		return String.format(
				"<li><span></span><h%d>%s</h%d></li>", 
				getLineIndex() + 1, 
				toHeader(getLineBody()), 
				getLineIndex() + 1
		).replace("lectura", "Lectura")
		.replace("I", "III");
	}

	private String toHeader(String body){
		if(Strings.isNullOrEmpty(body)){
			return "";
		}
		
		Iterable<String> words = Splitter.on(" ")
				.trimResults()
				.omitEmptyStrings()				
				.split(body.toLowerCase());
		StringBuilder headerBuilder = new StringBuilder();
		for (String word : words) {
			if(Strings.isNullOrEmpty(word)){
				continue;
			}
			
			char[] letters = word.toLowerCase().toCharArray();
			if(!NOT_UPPER_WORDS.contains(word)){
				char firstLetterInUpper = word.toUpperCase().charAt(0);			
				letters[0] = firstLetterInUpper;
			}			
			
			for (char letter : letters) {
				headerBuilder.append(letter);
			}
			headerBuilder.append(" ");
		}
		return headerBuilder.toString().trim();
	}
}
