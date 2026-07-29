import java.awt.Color;
import java.awt.Font;
import java.awt.Insets;
import javax.swing.UIManager;

/**
 * Design tokens for the Nimbus Swing design system.
 *
 * <p>Colors in the native palette mirror the OpenJDK Nimbus UI defaults. Semantic
 * feedback colors are the product-level extensions visible in the reference
 * screenshots.</p>
 */
public final class NimbusTokens {
    private NimbusTokens() {}

    // Native Nimbus color primitives.
    public static final Color CANVAS = new Color(214, 217, 223);          // #D6D9DF
    public static final Color SURFACE = Color.WHITE;                      // #FFFFFF
    public static final Color TEXT = Color.BLACK;                         // #000000
    public static final Color BASE = new Color(51, 98, 140);              // #33628C
    public static final Color BLUE_GREY = new Color(169, 176, 190);       // #A9B0BE
    public static final Color FOCUS = new Color(115, 164, 209);           // #73A4D1
    public static final Color SELECTION = new Color(57, 105, 138);        // #39698A
    public static final Color ORANGE = new Color(191, 98, 4);             // #BF6204
    public static final Color RED = new Color(169, 46, 34);               // #A92E22
    public static final Color INFO_BLUE = new Color(47, 92, 180);         // #2F5CB4
    public static final Color ALERT_YELLOW = new Color(255, 220, 35);     // #FFDC23
    public static final Color GREEN = new Color(176, 179, 50);            // #B0B332

    // Semantic extensions used by the showcase feedback cards.
    public static final Color SUCCESS = new Color(42, 120, 73);           // #2A7849
    public static final Color INFORMATION = new Color(50, 91, 149);       // #325B95
    public static final Color WARNING = new Color(153, 109, 25);          // #996D19
    public static final Color DANGER = new Color(157, 58, 58);            // #9D3A3A
    public static final Color MUTED_TEXT = new Color(128, 128, 128);      // #808080

    // A 4 px base spacing rhythm in logical Swing pixels.
    public static final int SPACE_1 = 4;
    public static final int SPACE_2 = 8;
    public static final int SPACE_3 = 12;
    public static final int SPACE_4 = 16;
    public static final int SPACE_5 = 24;
    public static final int SPACE_6 = 32;

    // Typography is deliberately based on logical point sizes, not screenshot pixels.
    public static final Font BODY = new Font(Font.SANS_SERIF, Font.PLAIN, 12);
    public static final Font BODY_STRONG = BODY.deriveFont(Font.BOLD);
    public static final Font SECTION = BODY.deriveFont(Font.BOLD, 14f);
    public static final Font PAGE_TITLE = BODY.deriveFont(Font.BOLD, 20f);
    public static final Font CAPTION = BODY.deriveFont(Font.PLAIN, 11f);

    // Native Nimbus content padding verified against UIManager on OpenJDK.
    public static final Insets BUTTON_INSETS = new Insets(6, 14, 6, 14);
    public static final Insets INPUT_INSETS = new Insets(6, 6, 6, 6);

    /** Applies only stable brand primitives; Nimbus painters still render every control. */
    public static void applyNativePalette() {
        UIManager.put("control", CANVAS);
        UIManager.put("text", TEXT);
        UIManager.put("nimbusBase", BASE);
        UIManager.put("nimbusBlueGrey", BLUE_GREY);
        UIManager.put("nimbusFocus", FOCUS);
        UIManager.put("nimbusLightBackground", SURFACE);
        UIManager.put("nimbusSelectionBackground", SELECTION);
        UIManager.put("nimbusOrange", ORANGE);
        UIManager.put("nimbusRed", RED);
        UIManager.put("nimbusInfoBlue", INFO_BLUE);
        UIManager.put("nimbusAlertYellow", ALERT_YELLOW);
        UIManager.put("nimbusGreen", GREEN);
    }
}
