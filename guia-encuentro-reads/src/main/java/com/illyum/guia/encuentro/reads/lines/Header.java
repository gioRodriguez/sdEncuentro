package com.illyum.guia.encuentro.reads.lines;

import java.util.ArrayList;
import java.util.List;

public class Header {

	private List<EntryHeader> _entries;
	
	private Header() {
		_entries = new ArrayList<EntryHeader>();
	}
	
	public static Header create() {
		return new Header();
	}

	public String toHtml() {
		StringBuilder builder = new StringBuilder();
		for (EntryHeader entry : _entries) {
			builder.append(entry.toHtml());
		}
		
		return String.format("<div class='readHeader'><ul>%s</ul></div><hr>", builder.toString());
	}

	public void addEntry(EntryHeader headerEntry) {
		_entries.add(headerEntry);
	}

}
