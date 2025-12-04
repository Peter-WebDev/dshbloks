import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="max-w-7xl mx-auto border-4 border-dotted px-8">
      {/* Typography Showcase */}
      <section class="py-12">
        <header class="pb-12">
          <h1>Typography Scale</h1>
          <p>Testing line heights and spacing across all heading levels. To be exchanged later on with info about the webapp.</p>
        </header>
        <hr class="fade-line" />
        <div class="pt-12">
            <h1>Heading 1 - Main Title</h1>
            <p>Body text following h1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, consequuntur facilis consequatur ipsum accusamus optio illum quidem laudantium eos? Molestiae quasi et impedit numquam aliquid assumenda quia id aperiam at.</p>
            <h2>Heading 2 - Section Title</h2>
            <p>Body text following h2. Mollitia nobis quisquam dolores, quaerat ex odio corrupti debitis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia nobis quisquam dolores, quaerat ex odio corrupti debitis.</p>    
            <h3>Heading 3 - Subsection</h3>
            <p>Body text following h3. Velit animi unde architecto quo nisi, ducimus vel facere. Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit animi unde architecto quo nisi, ducimus vel facere.</p>
            <h4>Heading 4 - Component Title</h4>
            <p>Body text following h4. Pariatur, cupiditate corporis possimus cumque totam deserunt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis suscipit, officiis officia illo dolor porro harum, corrupti ipsam assumenda voluptas fugiat, in architecto totam labore delectus saepe dicta est! Dolore.</p>
            <h5>Heading 5 - Card Title</h5>
            <p>Body text following h5. Iure, ea ad natus aliquam qui perferendis minus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, sequi voluptas? Aliquid suscipit corporis eum deleniti ab? Obcaecati architecto nisi quo provident, dolore deserunt eveniet accusantium cumque sunt natus repudiandae?</p>
            <h6>Heading 6 - Label</h6>
            <p>Body text following h6. Est dolores maxime sunt obcaecati consectetur harum. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam sed asperiores, aliquam et temporibus iusto, saepe nostrum illo sapiente omnis ipsum facilis laborum tenetur at necessitatibus, autem reprehenderit. Officia, perferendis.</p>
            <p class="text-sm">Small body text for captions and secondary information.</p>
            <p class="text-xs">Tiny text for timestamps, tags, and fine print.</p>
        </div>
      </section>
      <hr class="fade-line" />
      <section class="py-12">
        <p>
          Visit{" "}
          <a href="https://github.com/Peter-WebDev">
            github.com/Peter-WebDev
          </a>{" "}
          to learn how I built this SolidStart webapplication.
        </p>
      </section>
      <hr class="fade-line" />
      {/* Footer */}
      <footer class="py-12">
        <h2>Footer</h2>
        <A href="/">
          Home
        </A>
      </footer>
    </main>
  );
}
