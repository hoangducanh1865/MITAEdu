package com.mita.common.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public final class SlugUtil {
    private static final Pattern NON_ASCII = Pattern.compile("[^\\p{ASCII}]");
    private static final Pattern NON_SLUG  = Pattern.compile("[^a-z0-9-]");
    private static final Pattern DASHES    = Pattern.compile("-+");

    private SlugUtil() {}

    public static String toSlug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String ascii  = NON_ASCII.matcher(normalized).replaceAll("");
        String lower  = ascii.toLowerCase(Locale.ROOT);
        String slug   = NON_SLUG.matcher(lower).replaceAll("-");
        return DASHES.matcher(slug).replaceAll("-").replaceAll("^-|-$", "");
    }
}
