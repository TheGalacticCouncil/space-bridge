import com.structurizr.Workspace;
import com.structurizr.api.StructurizrClient;
import com.structurizr.documentation.Format;
import com.structurizr.documentation.StructurizrDocumentationTemplate;
import com.structurizr.model.*;
import com.structurizr.view.*;

/**
 * Simple class for manually constructing diagrams
 */
public class Structurizr {

    private static final long WORKSPACE_ID = 38780;

    private static final String DATABASE_TAG = "Database";
    private static final String EXISTING_SYSTEM_TAG = "Existing System";

    public static void main(String[] args) throws Exception {
        // a Structurizr workspace is the wrapper for a software architecture model,
        // views and documentation
        Workspace workspace = new Workspace("The Galactic Council",
                "System which makes it possible to use custom hardware input devices with Empty Epsilon.");
        Model model = workspace.getModel();

        model.setEnterprise(new Enterprise("The Galactic Council"));

        // add some elements to your software architecture model
        Person user = model.addPerson(Location.External, "Bridge Officer", "Bridge Officer of the spaceship");

        SoftwareSystem softwareSystem = model.addSoftwareSystem(Location.Internal, "Space Bridge",
                "Software system that turns HW inputs into reality.");
        SoftwareSystem hardwareBoard = model.addSoftwareSystem(Location.Internal, "Command station hardware",
                "Actual physical control board through which the bridge officer gives his input.");
        SoftwareSystem emptyEpsilon = model.addSoftwareSystem(Location.External, "Empty Epsilon",
                "Open source spaceship command bridge simulator.");

        emptyEpsilon.addTags(EXISTING_SYSTEM_TAG);

        Container galacticBroker = softwareSystem.addContainer("Galactic Broker",
                "An application that translates HW input into events and relays them further.", "Python");
        Container spaceNode = softwareSystem.addContainer("Space Node",
                "An application that listens for control events, has necessary logic to translate those into Empty Epsilon control values and post those to Empty Epsilon client.",
                "NodeJS");

        user.uses(hardwareBoard, "Uses");
        softwareSystem.uses(hardwareBoard, "Reads state");
        softwareSystem.uses(emptyEpsilon, "Sends commands to");

        // define some views
        ViewSet views = workspace.getViews();
        SystemContextView contextView = views.createSystemContextView(softwareSystem, "SystemContext",
                "A System Context diagram of Space Bridge.");
        contextView.setPaperSize(PaperSize.A4_Landscape);
        contextView.addAllSoftwareSystems();
        contextView.addAllPeople();

        // add some documentation
        StructurizrDocumentationTemplate template = new StructurizrDocumentationTemplate(workspace);
        template.addContextSection(softwareSystem, Format.Markdown,
                "Here is some context about the software system...\n" + "\n" + "![](embed:SystemContext)");

        // add some styling
        Styles styles = views.getConfiguration().getStyles();
        styles.addElementStyle(Tags.COMPONENT).background("#cb8150").color("#ffffff");
        styles.addElementStyle(Tags.SOFTWARE_SYSTEM).background("#1168bd").color("#ffffff");
        styles.addElementStyle(Tags.PERSON).background("#08427b").color("#ffffff").shape(Shape.Person);
        styles.addElementStyle(EXISTING_SYSTEM_TAG).background("#999999");
        styles.addElementStyle(DATABASE_TAG).shape(Shape.Cylinder);

        uploadWorkspaceToStructurizr(workspace);
    }

    private static void uploadWorkspaceToStructurizr(Workspace workspace) throws Exception {
        String API_KEY = System.getenv("STRUCTURIZR_API_KEY");
        String API_SECRET = System.getenv("STRUCTURIZR_API_SECRET");
        StructurizrClient structurizrClient = new StructurizrClient(API_KEY, API_SECRET);
        structurizrClient.putWorkspace(WORKSPACE_ID, workspace);
    }

}
