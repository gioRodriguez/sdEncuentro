package com.illyum.guia.encuentro.reads.lines;

import java.util.HashSet;
import java.util.Set;

import com.google.common.base.Splitter;
import com.google.common.base.Strings;

public class EntryHeader extends AbstractLine implements Entry {
	
	private static final Set<String> NOT_UPPER_WORDS = new HashSet<String>();
	static {
		NOT_UPPER_WORDS.add("del");
		NOT_UPPER_WORDS.add("de");
	}

	protected EntryHeader(
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
		 .replace("Iii", "III")
		 .replace("Iv", "IV");
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

	public static EntryHeader createLevelOneWithContent(String content) {
		return new EntryHeader(content, 0);
	}

	public static EntryHeader createLevelTwoWithContent(String content) {
		return new EntryHeader(content, 1);
	}
	
	public static EntryHeader createLevelThreeWithContent(String content) {
		return new EntryHeader(content, 2);
	}

	@Override
	public void addEntry(Entry entry) {
		// TODO Auto-generated method stub
		
	}
}
