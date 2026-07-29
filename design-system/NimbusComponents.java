import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.GridLayout;
import javax.swing.BorderFactory;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.UIManager;
import javax.swing.border.TitledBorder;

/** Small semantic factories layered on top of standard Nimbus Swing controls. */
public final class NimbusComponents {
    private NimbusComponents() {}

    public static JLabel pageTitle(String text) {
        JLabel label = new JLabel(text);
        label.setFont(NimbusTokens.PAGE_TITLE);
        return label;
    }

    public static JLabel sectionTitle(String text) {
        JLabel label = new JLabel(text);
        label.setFont(NimbusTokens.SECTION);
        return label;
    }

    public static JLabel mutedLabel(String text) {
        JLabel label = new JLabel(text);
        Color disabled = UIManager.getColor("Label.disabledForeground");
        label.setForeground(disabled != null ? disabled : NimbusTokens.MUTED_TEXT);
        return label;
    }

    public static JPanel titledPanel(String title) {
        JPanel panel = new JPanel();
        panel.setBorder(BorderFactory.createTitledBorder(
                BorderFactory.createEtchedBorder(),
                title,
                TitledBorder.LEADING,
                TitledBorder.TOP));
        return panel;
    }

    public static JPanel messageCard(String title, String detail, Color tone) {
        JPanel card = new JPanel(new GridLayout(2, 1));
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(tone),
                BorderFactory.createEmptyBorder(
                        NimbusTokens.SPACE_1,
                        NimbusTokens.SPACE_2,
                        NimbusTokens.SPACE_1,
                        NimbusTokens.SPACE_2)));
        JLabel heading = new JLabel(title);
        heading.setForeground(tone);
        heading.setFont(heading.getFont().deriveFont(Font.BOLD));
        card.add(heading);
        card.add(new JLabel(detail));
        return card;
    }

    public static JPanel swatch(String name, String value, Color color, boolean darkText) {
        JPanel swatch = new JPanel(new BorderLayout());
        swatch.setBackground(color);
        swatch.setOpaque(true);
        swatch.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(NimbusTokens.BLUE_GREY),
                BorderFactory.createEmptyBorder(
                        NimbusTokens.SPACE_2,
                        NimbusTokens.SPACE_2,
                        NimbusTokens.SPACE_2,
                        NimbusTokens.SPACE_2)));
        Color foreground = darkText ? NimbusTokens.TEXT : NimbusTokens.SURFACE;
        JLabel nameLabel = new JLabel(name);
        nameLabel.setForeground(foreground);
        nameLabel.setFont(nameLabel.getFont().deriveFont(Font.BOLD));
        JLabel valueLabel = new JLabel(value);
        valueLabel.setForeground(foreground);
        swatch.add(nameLabel, BorderLayout.NORTH);
        swatch.add(valueLabel, BorderLayout.SOUTH);
        return swatch;
    }
}
