package com.illyum.guia.encuentro.reads.lines;

import java.util.ArrayList;
import java.util.List;

public class ReadingBody {
	
	private List<Entry> _entries;
	
	private ReadingBody() {
		_entries = new ArrayList<Entry>();
	}
	
	public static ReadingBody create() {
		return new ReadingBody();
	}

	public String toHtml() {
		StringBuilder builder = new StringBuilder();
		for (Entry entry : _entries) {
			builder.append(entry.toHtml());
		}
		
		return String.format("<div class='readBoby'>%s</div>", builder.toString());
	}

	public void addEntry(Entry entryLine) {
		_entries.add(entryLine);
	}

}
