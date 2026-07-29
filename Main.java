import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.Insets;
import java.awt.event.KeyEvent;
import java.util.Arrays;
import javax.swing.BorderFactory;
import javax.swing.ButtonGroup;
import javax.swing.DefaultComboBoxModel;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JColorChooser;
import javax.swing.JComboBox;
import javax.swing.JDesktopPane;
import javax.swing.JFileChooser;
import javax.swing.JFormattedTextField;
import javax.swing.JFrame;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JProgressBar;
import javax.swing.JPopupMenu;
import javax.swing.JRadioButton;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;
import javax.swing.JSeparator;
import javax.swing.JSlider;
import javax.swing.JSpinner;
import javax.swing.JSplitPane;
import javax.swing.JTabbedPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.JToggleButton;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableModel;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeModel;
import javax.swing.JTree;

/** Executable catalog for the screenshot-derived Nimbus Swing design system. */
public final class Main {
    private static final Insets FIELD_INSETS = new Insets(4, 8, 4, 8);

    public static void main(String[] args) {
        installNimbus();
        SwingUtilities.invokeLater(Main::createAndShow);
    }

    private static void installNimbus() {
        try {
            for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (Exception ignored) {
            // The platform default remains usable if Nimbus is unavailable.
        }
        NimbusTokens.applyNativePalette();
    }

    private static void createAndShow() {
        JFrame frame = new JFrame("Nimbus Swing Design System");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setJMenuBar(createMenuBar());
        frame.add(createToolBar(), BorderLayout.NORTH);
        frame.add(createContent(), BorderLayout.CENTER);
        frame.add(createStatusBar(), BorderLayout.SOUTH);
        frame.setMinimumSize(new Dimension(1080, 700));
        frame.setSize(1220, 780);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private static JMenuBar createMenuBar() {
        JMenuBar menuBar = new JMenuBar();
        JMenu file = new JMenu("File");
        file.setMnemonic(KeyEvent.VK_F);
        file.add(new JMenuItem("New Mockup"));
        file.add(new JMenuItem("Open…"));
        file.add(new JSeparator());
        file.add(new JMenuItem("Exit"));

        JMenu edit = new JMenu("Edit");
        edit.setMnemonic(KeyEvent.VK_E);
        edit.add(new JMenuItem("Undo"));
        edit.add(new JMenuItem("Redo"));
        edit.add(new JSeparator());
        edit.add(new JMenuItem("Preferences…"));

        JMenu help = new JMenu("Help");
        help.add(new JMenuItem("Nimbus Gallery Help"));
        help.add(new JMenuItem("About"));
        menuBar.add(file);
        menuBar.add(edit);
        menuBar.add(help);
        return menuBar;
    }

    private static JToolBar createToolBar() {
        JToolBar toolBar = new JToolBar();
        toolBar.setFloatable(false);
        JButton newButton = new JButton("New");
        newButton.setToolTipText("Create a new mock workspace");
        JButton openButton = new JButton("Open");
        openButton.setToolTipText("Open the file chooser demo");
        JButton saveButton = new JButton("Save");
        saveButton.setToolTipText("Save is intentionally inactive in this mockup");
        openButton.addActionListener(event -> showFileChooser(toolBar));
        toolBar.add(newButton);
        toolBar.add(openButton);
        toolBar.add(saveButton);
        toolBar.addSeparator();
        JToggleButton grid = new JToggleButton("Grid", true);
        toolBar.add(grid);
        toolBar.add(new JToggleButton("Preview"));
        toolBar.addSeparator();
        toolBar.add(new JLabel("  View: "));
        toolBar.add(new JComboBox<>(new String[] {"Desktop", "Tablet", "Mobile"}));
        return toolBar;
    }

    private static JPanel createContent() {
        JPanel content = new JPanel(new BorderLayout(10, 10));
        content.setBorder(BorderFactory.createEmptyBorder(10, 12, 10, 12));
        content.add(createHeader(), BorderLayout.NORTH);
        content.add(createTabs(), BorderLayout.CENTER);
        return content;
    }

    private static JPanel createHeader() {
        JPanel header = new JPanel(new BorderLayout());
        JLabel title = NimbusComponents.pageTitle("Nimbus Swing Design System");
        JLabel caption = NimbusComponents.mutedLabel(
                "Foundations, components, patterns and states derived from the reference screenshots.");
        JPanel words = new JPanel(new GridLayout(2, 1));
        words.add(title);
        words.add(caption);
        header.add(words, BorderLayout.WEST);
        header.add(new JButton("Primary action"), BorderLayout.EAST);
        return header;
    }

    private static JTabbedPane createTabs() {
        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Foundations", createFoundationsTab());
        tabs.addTab("Controls", createControlsTab());
        tabs.addTab("Data views", createDataTab());
        tabs.addTab("Feedback", createFeedbackTab());
        tabs.addTab("Overlays", createDialogsTab());
        tabs.setMnemonicAt(0, KeyEvent.VK_F);
        tabs.setMnemonicAt(1, KeyEvent.VK_C);
        tabs.setMnemonicAt(2, KeyEvent.VK_D);
        tabs.setMnemonicAt(3, KeyEvent.VK_B);
        tabs.setMnemonicAt(4, KeyEvent.VK_O);
        return tabs;
    }

    private static JPanel createFoundationsTab() {
        JPanel panel = new JPanel(new BorderLayout(
                NimbusTokens.SPACE_3, NimbusTokens.SPACE_3));
        panel.add(createPalettePanel(), BorderLayout.NORTH);

        JPanel references = new JPanel(new GridLayout(
                1, 3, NimbusTokens.SPACE_3, NimbusTokens.SPACE_3));
        references.add(createTypographyPanel());
        references.add(createSpacingPanel());
        references.add(createStatePanel());
        panel.add(references, BorderLayout.CENTER);
        return panel;
    }

    private static JPanel createPalettePanel() {
        JPanel palette = titledPanel("Color foundations");
        palette.setLayout(new GridLayout(
                2, 6, NimbusTokens.SPACE_2, NimbusTokens.SPACE_2));
        palette.add(NimbusComponents.swatch("Canvas", "#D6D9DF", NimbusTokens.CANVAS, true));
        palette.add(NimbusComponents.swatch("Surface", "#FFFFFF", NimbusTokens.SURFACE, true));
        palette.add(NimbusComponents.swatch("Base", "#33628C", NimbusTokens.BASE, false));
        palette.add(NimbusComponents.swatch("Focus", "#73A4D1", NimbusTokens.FOCUS, true));
        palette.add(NimbusComponents.swatch("Selection", "#39698A", NimbusTokens.SELECTION, false));
        palette.add(NimbusComponents.swatch("Progress", "#BF6204", NimbusTokens.ORANGE, false));
        palette.add(NimbusComponents.swatch("Blue grey", "#A9B0BE", NimbusTokens.BLUE_GREY, true));
        palette.add(NimbusComponents.swatch("Success", "#2A7849", NimbusTokens.SUCCESS, false));
        palette.add(NimbusComponents.swatch("Information", "#325B95", NimbusTokens.INFORMATION, false));
        palette.add(NimbusComponents.swatch("Warning", "#996D19", NimbusTokens.WARNING, false));
        palette.add(NimbusComponents.swatch("Danger", "#9D3A3A", NimbusTokens.DANGER, false));
        palette.add(NimbusComponents.swatch("Text", "#000000", NimbusTokens.TEXT, false));
        palette.setPreferredSize(new Dimension(100, 190));
        return palette;
    }

    private static JPanel createTypographyPanel() {
        JPanel typography = titledPanel("Typography");
        typography.setLayout(new GridLayout(5, 1, 0, NimbusTokens.SPACE_1));

        JLabel page = new JLabel("Page title · 20 Bold");
        page.setFont(NimbusTokens.PAGE_TITLE);
        JLabel section = new JLabel("Section title · 14 Bold");
        section.setFont(NimbusTokens.SECTION);
        JLabel strong = new JLabel("Body strong · 12 Bold");
        strong.setFont(NimbusTokens.BODY_STRONG);
        JLabel body = new JLabel("Body · 12 Regular");
        body.setFont(NimbusTokens.BODY);
        JLabel caption = NimbusComponents.mutedLabel("Caption · 11 Regular");
        caption.setFont(NimbusTokens.CAPTION);

        typography.add(page);
        typography.add(section);
        typography.add(strong);
        typography.add(body);
        typography.add(caption);
        return typography;
    }

    private static JPanel createSpacingPanel() {
        JPanel spacing = titledPanel("4 px spacing rhythm");
        spacing.setLayout(new GridLayout(6, 1, 0, NimbusTokens.SPACE_1));
        spacing.add(spacingSample("Space 1", NimbusTokens.SPACE_1));
        spacing.add(spacingSample("Space 2", NimbusTokens.SPACE_2));
        spacing.add(spacingSample("Space 3", NimbusTokens.SPACE_3));
        spacing.add(spacingSample("Space 4", NimbusTokens.SPACE_4));
        spacing.add(spacingSample("Space 5", NimbusTokens.SPACE_5));
        spacing.add(spacingSample("Space 6", NimbusTokens.SPACE_6));
        return spacing;
    }

    private static JPanel spacingSample(String name, int size) {
        JPanel row = new JPanel(new BorderLayout(NimbusTokens.SPACE_2, 0));
        row.add(new JLabel(name + " · " + size + " px"), BorderLayout.WEST);
        JPanel bar = new JPanel();
        bar.setBackground(NimbusTokens.BASE);
        bar.setPreferredSize(new Dimension(size * 4, 10));
        row.add(bar, BorderLayout.EAST);
        return row;
    }

    private static JPanel createStatePanel() {
        JPanel states = titledPanel("Component states");
        states.setLayout(new GridLayout(6, 1, 0, NimbusTokens.SPACE_1));
        JButton normal = new JButton("Default");
        normal.setToolTipText("Default and hover states are rendered by Nimbus");
        JButton disabled = new JButton("Disabled");
        disabled.setEnabled(false);
        JToggleButton selected = new JToggleButton("Selected", true);
        JTextField editable = new JTextField("Editable input");
        JTextField readOnly = new JTextField("Read-only input");
        readOnly.setEditable(false);
        JCheckBox unavailable = new JCheckBox("Unavailable option", true);
        unavailable.setEnabled(false);
        states.add(normal);
        states.add(disabled);
        states.add(selected);
        states.add(editable);
        states.add(readOnly);
        states.add(unavailable);
        return states;
    }

    private static JPanel createControlsTab() {
        JPanel panel = new JPanel(new GridLayout(1, 2, 10, 10));
        panel.add(createFormPanel());
        panel.add(createSelectionPanel());
        return panel;
    }

    private static JPanel createFormPanel() {
        JPanel form = titledPanel("Text input");
        form.setLayout(new GridBagLayout());
        GridBagConstraints c = new GridBagConstraints();
        c.insets = FIELD_INSETS;
        c.anchor = GridBagConstraints.WEST;
        c.fill = GridBagConstraints.HORIZONTAL;
        c.weightx = 1;
        addField(form, c, 0, "Name", new JTextField("Morgan Lee", 18));
        addField(form, c, 1, "Email", new JTextField("morgan@example.com", 18));
        addField(form, c, 2, "Password", new JPasswordField("demopass", 18));
        addField(form, c, 3, "Role", new JComboBox<>(new String[] {"Designer", "Developer", "Manager"}));
        addField(form, c, 4, "Date", new JFormattedTextField("2026-07-30"));
        addField(form, c, 5, "Quantity", new JSpinner());
        c.gridx = 0;
        c.gridy = 6;
        c.gridwidth = 2;
        c.weighty = 1;
        c.anchor = GridBagConstraints.NORTHWEST;
        form.add(new JLabel("Notes"), c);
        JTextArea notes = new JTextArea("Multiline text area\nwith scroll support.", 4, 18);
        c.gridy = 7;
        c.fill = GridBagConstraints.BOTH;
        form.add(new JScrollPane(notes), c);
        return form;
    }

    private static void addField(JPanel panel, GridBagConstraints c, int row, String label, java.awt.Component field) {
        c.gridy = row;
        c.gridx = 0;
        c.gridwidth = 1;
        c.weightx = 0;
        panel.add(new JLabel(label), c);
        c.gridx = 1;
        c.weightx = 1;
        panel.add(field, c);
    }

    private static JPanel createSelectionPanel() {
        JPanel selection = new JPanel(new GridLayout(3, 1, 6, 6));
        JPanel checks = titledPanel("Options");
        checks.setLayout(new GridLayout(3, 1));
        checks.add(new JCheckBox("Enable notifications", true));
        checks.add(new JCheckBox("Keep workspace private"));
        JCheckBox disabled = new JCheckBox("Unavailable option", true);
        disabled.setEnabled(false);
        checks.add(disabled);

        JPanel radios = titledPanel("Plan");
        radios.setLayout(new GridLayout(3, 1));
        ButtonGroup plans = new ButtonGroup();
        for (String name : Arrays.asList("Starter", "Professional", "Enterprise")) {
            JRadioButton radio = new JRadioButton(name, "Professional".equals(name));
            plans.add(radio);
            radios.add(radio);
        }

        JPanel buttons = titledPanel("Buttons & slider");
        buttons.setLayout(new GridBagLayout());
        GridBagConstraints c = new GridBagConstraints();
        c.insets = new Insets(4, 5, 4, 5);
        c.gridx = 0; c.gridy = 0;
        buttons.add(new JButton("Default"), c);
        c.gridx = 1;
        buttons.add(new JButton("Secondary"), c);
        c.gridx = 2;
        JButton unavailable = new JButton("Disabled");
        unavailable.setEnabled(false);
        buttons.add(unavailable, c);
        c.gridx = 0; c.gridy = 1; c.gridwidth = 3; c.fill = GridBagConstraints.HORIZONTAL; c.weightx = 1;
        buttons.add(new JSlider(0, 100, 65), c);
        selection.add(checks);
        selection.add(radios);
        selection.add(buttons);
        return selection;
    }

    private static JPanel createDataTab() {
        JSplitPane split = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, createTreePanel(), createTablePanel());
        split.setResizeWeight(.27);
        JPanel panel = new JPanel(new BorderLayout());
        panel.add(split, BorderLayout.CENTER);
        return panel;
    }

    private static JPanel createTreePanel() {
        DefaultMutableTreeNode root = new DefaultMutableTreeNode("Workspace");
        DefaultMutableTreeNode project = new DefaultMutableTreeNode("Nimbus demo");
        project.add(new DefaultMutableTreeNode("src"));
        project.add(new DefaultMutableTreeNode("resources"));
        root.add(project);
        root.add(new DefaultMutableTreeNode("Archived"));
        JTree tree = new JTree(new DefaultTreeModel(root));
        JPanel panel = new JPanel(new BorderLayout(0, 6));
        panel.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 6));
        panel.add(new JLabel("Project explorer"), BorderLayout.NORTH);
        panel.add(new JScrollPane(tree), BorderLayout.CENTER);
        return panel;
    }

    private static JPanel createTablePanel() {
        String[] columns = {"Component", "Status", "Owner", "Updated"};
        Object[][] rows = {
            {"Button hierarchy", "Ready", "D. Kim", "Today"},
            {"Form validation", "In review", "A. Park", "Yesterday"},
            {"Table styling", "Ready", "M. Lee", "Jul 28"},
            {"Empty states", "Draft", "J. Choi", "Jul 25"}
        };
        JTable table = new JTable(new DefaultTableModel(rows, columns) {
            @Override public boolean isCellEditable(int row, int column) { return false; }
        });
        table.setAutoCreateRowSorter(true);
        table.setToolTipText("Right-click to open the context menu");
        JPopupMenu tableMenu = new JPopupMenu();
        tableMenu.add(new JMenuItem("Open component"));
        tableMenu.add(new JMenuItem("Duplicate"));
        tableMenu.add(new JSeparator());
        tableMenu.add(new JMenuItem("Archive"));
        table.setComponentPopupMenu(tableMenu);
        DefaultListModel<String> activities = new DefaultListModel<>();
        activities.addElement("Saved workspace settings");
        activities.addElement("Updated preview device");
        activities.addElement("Imported sample data");
        JPanel activity = titledPanel("Recent activity");
        activity.setLayout(new BorderLayout());
        activity.add(new JScrollPane(new JList<>(activities)), BorderLayout.CENTER);
        JPanel result = new JPanel(new BorderLayout(0, 8));
        result.setBorder(BorderFactory.createEmptyBorder(8, 6, 8, 8));
        JScrollPane tableScroll = new JScrollPane(table);
        tableScroll.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        tableScroll.setRowHeaderView(new JList<>(new String[] {"1", "2", "3", "4"}));
        result.add(tableScroll, BorderLayout.CENTER);
        result.add(activity, BorderLayout.SOUTH);
        return result;
    }

    private static JPanel createFeedbackTab() {
        JPanel panel = new JPanel(new GridLayout(1, 2, 10, 10));
        JPanel progress = titledPanel("Progress indicators");
        progress.setLayout(new GridBagLayout());
        GridBagConstraints c = new GridBagConstraints();
        c.insets = FIELD_INSETS; c.gridx = 0; c.fill = GridBagConstraints.HORIZONTAL; c.weightx = 1;
        c.gridy = 0; progress.add(new JLabel("Upload progress"), c);
        JProgressBar upload = new JProgressBar(0, 100); upload.setValue(72); upload.setStringPainted(true);
        c.gridy = 1; progress.add(upload, c);
        c.gridy = 2; progress.add(new JLabel("Background task"), c);
        JProgressBar loading = new JProgressBar(); loading.setIndeterminate(true);
        c.gridy = 3; progress.add(loading, c);
        c.gridy = 4; progress.add(new JLabel("Horizontal scroll bar"), c);
        JScrollBar scrollBar = new JScrollBar(SwingConstants.HORIZONTAL, 38, 18, 0, 100);
        scrollBar.setToolTipText("A standalone JScrollBar component");
        c.gridy = 5; progress.add(scrollBar, c);
        c.gridy = 6; c.weighty = 1; c.anchor = GridBagConstraints.NORTHWEST;
        progress.add(new JLabel("Static examples of determinate and indeterminate feedback."), c);

        JPanel messages = titledPanel("Messages");
        messages.setLayout(new GridLayout(4, 1, 5, 5));
        messages.add(message("✓  Success", "All changes have been saved.", NimbusTokens.SUCCESS));
        messages.add(message("i  Information", "A new version is available.", NimbusTokens.INFORMATION));
        messages.add(message("!  Warning", "This is only a visual mockup.", NimbusTokens.WARNING));
        messages.add(message("×  Error", "Connection could not be verified.", NimbusTokens.DANGER));
        panel.add(progress);
        panel.add(messages);
        return panel;
    }

    private static JPanel createDialogsTab() {
        JPanel panel = new JPanel(new GridLayout(1, 2, 10, 10));
        panel.add(createDialogLauncherPanel());
        panel.add(createDesktopPanePanel());
        return panel;
    }

    private static JPanel createDialogLauncherPanel() {
        JPanel launchers = titledPanel("Dialog & menu samples");
        launchers.setLayout(new GridBagLayout());
        GridBagConstraints c = new GridBagConstraints();
        c.insets = new Insets(6, 8, 6, 8);
        c.gridx = 0;
        c.fill = GridBagConstraints.HORIZONTAL;
        c.weightx = 1;

        JLabel description = new JLabel("Each button opens a standard Nimbus dialog.");
        c.gridy = 0;
        launchers.add(description, c);

        JButton info = new JButton("Information message");
        info.addActionListener(event -> JOptionPane.showMessageDialog(launchers,
                "This is an information message.", "Nimbus Gallery", JOptionPane.INFORMATION_MESSAGE));
        c.gridy = 1;
        launchers.add(info, c);

        JButton warning = new JButton("Confirmation message");
        warning.addActionListener(event -> JOptionPane.showConfirmDialog(launchers,
                "Would you like to continue viewing this mockup?", "Confirmation", JOptionPane.YES_NO_CANCEL_OPTION));
        c.gridy = 2;
        launchers.add(warning, c);

        JButton file = new JButton("Open file chooser");
        file.setToolTipText("Shows JFileChooser");
        file.addActionListener(event -> showFileChooser(launchers));
        c.gridy = 3;
        launchers.add(file, c);

        JButton color = new JButton("Open color chooser");
        color.setToolTipText("Shows JColorChooser");
        color.addActionListener(event -> JColorChooser.showDialog(launchers,
                "Choose an accent color", new Color(88, 130, 190)));
        c.gridy = 4;
        launchers.add(color, c);

        JButton context = new JButton("Open context menu");
        context.setToolTipText("Shows JPopupMenu");
        JPopupMenu menu = new JPopupMenu();
        menu.add(new JMenuItem("Rename"));
        menu.add(new JMenuItem("Move to folder"));
        menu.add(new JSeparator());
        menu.add(new JMenuItem("Delete"));
        context.addActionListener(event -> menu.show(context, 0, context.getHeight()));
        c.gridy = 5;
        launchers.add(context, c);

        c.gridy = 6;
        c.weighty = 1;
        c.anchor = GridBagConstraints.NORTHWEST;
        JLabel hint = new JLabel("Tip: the table on the Data views tab also has a right-click menu.");
        hint.setForeground(UIManager.getColor("Label.disabledForeground"));
        launchers.add(hint, c);
        return launchers;
    }

    private static void showFileChooser(java.awt.Component parent) {
        JFileChooser chooser = new JFileChooser();
        chooser.setDialogTitle("Open a mockup file");
        chooser.showOpenDialog(parent);
    }

    private static JPanel createDesktopPanePanel() {
        JPanel panel = titledPanel("Internal windows");
        panel.setLayout(new BorderLayout());
        JDesktopPane desktop = new JDesktopPane();
        desktop.setBackground(UIManager.getColor("Panel.background"));

        JInternalFrame inspector = new JInternalFrame("Inspector", true, true, true, true);
        JPanel inspectorBody = new JPanel(new GridLayout(3, 1, 4, 4));
        inspectorBody.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));
        inspectorBody.add(new JLabel("Selected: Primary action"));
        inspectorBody.add(new JLabel("State: Default"));
        inspectorBody.add(new JCheckBox("Visible", true));
        inspector.add(inspectorBody);
        inspector.setBounds(18, 20, 250, 150);
        inspector.setVisible(true);

        JInternalFrame preview = new JInternalFrame("Preview", true, true, true, true);
        JPanel previewBody = new JPanel(new BorderLayout(6, 6));
        previewBody.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));
        previewBody.add(new JLabel("Mini preview"), BorderLayout.NORTH);
        JProgressBar miniProgress = new JProgressBar(0, 100);
        miniProgress.setValue(60);
        miniProgress.setStringPainted(true);
        previewBody.add(miniProgress, BorderLayout.CENTER);
        preview.add(previewBody);
        preview.setBounds(155, 150, 270, 130);
        preview.setVisible(true);

        desktop.add(inspector);
        desktop.add(preview);
        panel.add(desktop, BorderLayout.CENTER);
        return panel;
    }

    private static JPanel message(String title, String detail, Color color) {
        return NimbusComponents.messageCard(title, detail, color);
    }

    private static JPanel titledPanel(String title) {
        return NimbusComponents.titledPanel(title);
    }

    private static JPanel createStatusBar() {
        JPanel status = new JPanel(new BorderLayout());
        status.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createMatteBorder(1, 0, 0, 0,
                UIManager.getColor("Separator.foreground")), BorderFactory.createEmptyBorder(5, 12, 5, 12)));
        status.add(new JLabel("Ready  •  Nimbus Look & Feel"), BorderLayout.WEST);
        status.add(new JLabel("Design system catalog", SwingConstants.RIGHT), BorderLayout.EAST);
        return status;
    }
}
