package com.illyum.guia.encuentro.reads.lines;

import java.util.HashSet;
import java.util.Set;

import com.google.common.base.Splitter;
import com.google.common.base.Strings;

public class EntryHeader implements Entry {
	
	private static final Set<String> NOT_UPPER_WORDS = new HashSet<String>();
	static {
		NOT_UPPER_WORDS.add("del");
		NOT_UPPER_WORDS.add("de");
	}
	
	private final String _headerContent;
	private final int _headerLevel;
	
	private EntryHeader(
		String headerContent,
		int headerLevel
	) {
		_headerContent = headerContent;
		_headerLevel = headerLevel;
	}

	@Override
	public String toHtml() {
		return String.format(
				"<li><span></span><h%d>%s</h%d></li>", 
				_headerLevel + 1, 
				toHeader(_headerContent), 
				_headerLevel + 1
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
}
