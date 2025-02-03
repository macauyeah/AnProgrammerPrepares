// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">前言 編寫這堆電子垃圾的原因 Why I write these articles - </a></li><li class="chapter-item expanded affix "><li class="part-title">Docker</li><li class="chapter-item expanded "><a href="VMDockerNotes/DockerConcept101CN.html"><strong aria-hidden="true">1.</strong> Docker的基本概念</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/BinaryAsDockerImageCN.html"><strong aria-hidden="true">2.</strong> Build Command Line Application Docker Image - 中文</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/DistributionRegistry.html"><strong aria-hidden="true">3.</strong> Docker Tag 命名</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/DeployDockerClusterCN.html"><strong aria-hidden="true">4.</strong> Deploy Docker Cluster - 中文</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/SwarmModeCommandCN.html"><strong aria-hidden="true">5.</strong> Swarm mode 上線</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/SwarmModeUndeployLeaveCN.html"><strong aria-hidden="true">6.</strong> Swarm mode 上線 2</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/SwarmModeRollbackCN.html"><strong aria-hidden="true">7.</strong> Swarm mode 上線 3 - Rollback 回滾</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/SwarmModeRollbackCN.html"><strong aria-hidden="true">8.</strong> Swarm mode 上線 4 - IP 設定</a></li><li class="chapter-item expanded "><a href="SwarmModeLoadBalancer.html"><strong aria-hidden="true">9.</strong> Swarm mode 上線 5 - load balancer 負載平衡器</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/CronJobWithDockerCN.html"><strong aria-hidden="true">10.</strong> Schedule Job with Docker - 中文</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/DockerArgEnvCN.html"><strong aria-hidden="true">11.</strong> Docker Variable control - 中文</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/OracleCN.html"><strong aria-hidden="true">12.</strong> 於 Docker 中運行 Oracle</a></li><li class="chapter-item expanded affix "><li class="part-title">Podman</li><li class="chapter-item expanded "><a href="VMDockerNotes/SteamDeckWithPodmanCN.html"><strong aria-hidden="true">13.</strong> SteamDeck 上的 Podman</a></li><li class="chapter-item expanded affix "><li class="part-title">VM</li><li class="chapter-item expanded "><a href="VMDockerNotes/MultipassPackerCN.html"><strong aria-hidden="true">14.</strong> Create custom Ubuntu cloud-img with Packer - 中文</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/MultipassStaticIpCN.html"><strong aria-hidden="true">15.</strong> Multipass with static IP - 中文</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/MultipassDockerClusterCN.html"><strong aria-hidden="true">16.</strong> Docker Swarm in Multipass - 中文</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/VmwareDockerClusterCN.html"><strong aria-hidden="true">17.</strong> Docker Swarm in Vmware - 中文</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/DockerWithNfsCN.html"><strong aria-hidden="true">18.</strong> Docker with NFS file store - 中文</a></li><li class="chapter-item expanded "><a href="VMDockerNotes/DockerSyslogCN.html"><strong aria-hidden="true">19.</strong> Docker with Syslog - 中文</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Git</li><li class="chapter-item expanded "><a href="gitNotes/gitcoworkflow.html"><strong aria-hidden="true">20.</strong> Git Co-Work Flow</a></li><li class="chapter-item expanded "><a href="gitNotes/github-flow.html"><strong aria-hidden="true">21.</strong> Github workflow</a></li><li class="chapter-item expanded "><a href="gitNotes/submodule.html"><strong aria-hidden="true">22.</strong> Git Submodule</a></li><li class="chapter-item expanded "><a href="gitNotes/git-merge-timing.html"><strong aria-hidden="true">23.</strong> Git Merge Timing</a></li><li class="chapter-item expanded "><a href="gitNotes/git-continuous-integration-strategy.html"><strong aria-hidden="true">24.</strong> Continuous Integration Strategy</a></li><li class="chapter-item expanded "><a href="gitNotes/git-mono-repo.html"><strong aria-hidden="true">25.</strong> Git Mono Repository</a></li><li class="chapter-item expanded "><a href="gitNotes/git-worktree.html"><strong aria-hidden="true">26.</strong> Git Worktree</a></li><li class="chapter-item expanded "><a href="gitNotes/git-revise-history.html"><strong aria-hidden="true">27.</strong> Git 修改歷史記錄</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Spring boot</li><li class="chapter-item expanded "><a href="spring/springBootMavenCheatSheet.html"><strong aria-hidden="true">28.</strong> Spring Boot - Maven Cheat Sheet 貓紙</a></li><li class="chapter-item expanded "><a href="spring/springBootWebSocket.html"><strong aria-hidden="true">29.</strong> Websocke and HTTP 1.1</a></li><li class="chapter-item expanded "><a href="spring/springBootDataCodeFirst.html"><strong aria-hidden="true">30.</strong> Spring Data Jpa 自動化的選擇 - Code First</a></li><li class="chapter-item expanded "><a href="spring/springBootMultipleDatasource.html"><strong aria-hidden="true">31.</strong> Multiple datasource</a></li><li class="chapter-item expanded "><a href="spring/javaLambda.html"><strong aria-hidden="true">32.</strong> Java Lamdbda</a></li><li class="chapter-item expanded "><a href="spring/javaLambda2.html"><strong aria-hidden="true">33.</strong> Java Lamdbda - Sorting</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Spring boot tutorial</li><li class="chapter-item expanded "><a href="spring/springBootLesson/01-command-line-application.html"><strong aria-hidden="true">34.</strong> Spring Boot 01 - 萬物始於Spring boot context</a></li><li class="chapter-item expanded "><a href="spring/springBootLesson/02-spring-data-jpa.html"><strong aria-hidden="true">35.</strong> Spring Boot 02 - 快速接入Database的選擇: Spring Data JPA</a></li><li class="chapter-item expanded "><a href="spring/springBootLesson/03-spring-data-test-case.html"><strong aria-hidden="true">36.</strong> Spring Boot 03 - 做好Database的模組化及測試用例</a></li><li class="chapter-item expanded "><a href="spring/springBootLesson/04-spring-web-api.html"><strong aria-hidden="true">37.</strong> Spring Boot 04 - 進入http json api 世代</a></li><li class="chapter-item expanded "><a href="spring/springBootLesson/05-spring-web-spring-data.html"><strong aria-hidden="true">38.</strong> Spring Boot 05 - 為 http json api 加入登入要求</a></li><li class="chapter-item expanded "><a href="spring/springBootLesson/06-spring-web-debug.html"><strong aria-hidden="true">39.</strong> Spring Boot 06 - Spring Boot Web 調試工具</a></li><li class="chapter-item expanded "><a href="spring/springBootLesson/07-spring-web-api-validate.html"><strong aria-hidden="true">40.</strong> Spring Boot 07 - Spring Boot Web 加入限制</a></li><li class="chapter-item expanded "><a href="spring/springBootLesson/spring-web-structure.html"><strong aria-hidden="true">41.</strong> draft structure</a></li><li class="chapter-item expanded affix "><li class="part-title">vue js</li><li class="chapter-item expanded "><a href="vuejs/TimeAttack.html"><strong aria-hidden="true">42.</strong> draft time attact</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
