const db = require('./connection');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Prompt = require('../models/Prompt');

async function seedDatabase() {
    try {
        console.log('🌱 Seeding database...');
        
        // Initialize database connection
        await db.initialize();

        // Create categories
        const categories = await Promise.all([
            Category.create({
                name: 'Code Generation',
                description: 'Prompts for generating code in various programming languages',
                color: '#3B82F6'
            }),
            Category.create({
                name: 'Writing & Content',
                description: 'Prompts for creative writing and content creation',
                color: '#10B981'
            }),
            Category.create({
                name: 'Analysis & Research',
                description: 'Prompts for data analysis and research tasks',
                color: '#8B5CF6'
            }),
            Category.create({
                name: 'Business & Marketing',
                description: 'Prompts for business and marketing tasks',
                color: '#F59E0B'
            }),
            Category.create({
                name: 'Education & Learning',
                description: 'Prompts for educational content and learning',
                color: '#EF4444'
            })
        ]);

        // Create sample prompts
        const prompts = [
            {
                title: 'Python Function Generator',
                content: 'Create a Python function that {function_description}. The function should:\n\n1. Have appropriate parameter validation\n2. Include docstrings following PEP 257\n3. Handle edge cases gracefully\n4. Return meaningful results\n\nFunction requirements:\n- Name: {function_name}\n- Parameters: {parameters}\n- Return type: {return_type}',
                description: 'Template for generating well-documented Python functions with validation',
                categoryId: categories[0].id,
                tags: ['python', 'function', 'template', 'documentation'],
                isTemplate: true,
                variables: [
                    {
                        name: 'function_description',
                        description: 'What the function should do',
                        defaultValue: 'calculates the sum of two numbers',
                        variableType: 'text',
                        required: true
                    },
                    {
                        name: 'function_name',
                        description: 'Name of the function',
                        defaultValue: 'calculate_sum',
                        variableType: 'text',
                        required: true
                    },
                    {
                        name: 'parameters',
                        description: 'Function parameters',
                        defaultValue: 'a: int, b: int',
                        variableType: 'text',
                        required: true
                    },
                    {
                        name: 'return_type',
                        description: 'Return type of the function',
                        defaultValue: 'int',
                        variableType: 'text',
                        required: true
                    }
                ]
            },
            {
                title: 'Blog Post Outline',
                content: 'Create a comprehensive blog post outline for "{topic}". The outline should include:\n\n1. **Compelling headline** (include 2-3 options)\n2. **Introduction** - Hook, problem statement, and preview\n3. **Main sections** (3-5 sections with subpoints)\n4. **Conclusion** - Summary and call-to-action\n5. **SEO considerations** - Keywords and meta description\n\nTarget audience: {audience}\nTone: {tone}\nWord count: {word_count}',
                description: 'Template for creating detailed blog post outlines',
                categoryId: categories[1].id,
                tags: ['writing', 'blog', 'content', 'template', 'seo'],
                isTemplate: true,
                variables: [
                    {
                        name: 'topic',
                        description: 'Main topic of the blog post',
                        defaultValue: 'Getting Started with Machine Learning',
                        variableType: 'text',
                        required: true
                    },
                    {
                        name: 'audience',
                        description: 'Target audience for the post',
                        defaultValue: 'Beginners in data science',
                        variableType: 'text',
                        required: true
                    },
                    {
                        name: 'tone',
                        description: 'Writing tone',
                        defaultValue: 'Professional but friendly',
                        variableType: 'select',
                        options: ['Professional', 'Casual', 'Academic', 'Conversational', 'Authoritative'],
                        required: true
                    },
                    {
                        name: 'word_count',
                        description: 'Target word count',
                        defaultValue: '1500-2000',
                        variableType: 'text',
                        required: false
                    }
                ]
            },
            {
                title: 'Data Analysis Report',
                content: 'Analyze the provided dataset and create a comprehensive report with the following sections:\n\n## Executive Summary\n- Key findings and insights\n- Main recommendations\n\n## Data Overview\n- Dataset description\n- Variables and data types\n- Data quality assessment\n\n## Exploratory Data Analysis\n- Descriptive statistics\n- Distribution analysis\n- Correlation analysis\n- Outlier detection\n\n## Key Insights\n- Significant patterns\n- Anomalies or interesting findings\n- Business implications\n\n## Recommendations\n- Actionable insights\n- Next steps\n- Limitations and considerations\n\nPlease use visualizations where appropriate and explain all findings in business terms.',
                description: 'Comprehensive template for data analysis reports',
                categoryId: categories[2].id,
                tags: ['data-analysis', 'report', 'business-intelligence', 'template'],
                isTemplate: true,
                isFavorite: true
            },
            {
                title: 'Marketing Campaign Brief',
                content: 'Create a marketing campaign brief for {product_name}:\n\n## Campaign Objectives\n- Primary goal: {primary_goal}\n- Secondary goals: {secondary_goals}\n- Success metrics: {success_metrics}\n\n## Target Audience\n- Demographics: {demographics}\n- Psychographics: {psychographics}\n- Pain points: {pain_points}\n\n## Key Messages\n- Value proposition: {value_proposition}\n- Supporting messages: {supporting_messages}\n\n## Campaign Strategy\n- Channels: {channels}\n- Timeline: {timeline}\n- Budget allocation: {budget}\n\n## Creative Direction\n- Tone and style: {tone_style}\n- Visual elements: {visual_elements}\n- Call-to-action: {cta}',
                description: 'Template for creating comprehensive marketing campaign briefs',
                categoryId: categories[3].id,
                tags: ['marketing', 'campaign', 'strategy', 'template'],
                isTemplate: true,
                variables: [
                    {
                        name: 'product_name',
                        description: 'Name of the product or service',
                        defaultValue: 'New Software Product',
                        variableType: 'text',
                        required: true
                    },
                    {
                        name: 'primary_goal',
                        description: 'Main campaign objective',
                        defaultValue: 'Increase brand awareness',
                        variableType: 'select',
                        options: ['Increase brand awareness', 'Generate leads', 'Drive sales', 'Launch new product', 'Customer retention'],
                        required: true
                    }
                ]
            },
            {
                title: 'Code Review Checklist',
                content: 'Use this checklist when reviewing code:\n\n## Functionality\n- [ ] Code accomplishes what it\'s supposed to do\n- [ ] Edge cases are handled properly\n- [ ] Error handling is appropriate\n- [ ] Performance considerations are addressed\n\n## Code Quality\n- [ ] Code is readable and well-structured\n- [ ] Variable and function names are descriptive\n- [ ] Comments explain the \'why\', not the \'what\'\n- [ ] No code duplication (DRY principle)\n- [ ] Functions are focused and do one thing well\n\n## Security\n- [ ] Input validation is implemented\n- [ ] No hardcoded secrets or sensitive data\n- [ ] SQL injection protection (if applicable)\n- [ ] XSS protection (if applicable)\n\n## Testing\n- [ ] Unit tests are present and comprehensive\n- [ ] Integration tests cover main workflows\n- [ ] Test names are descriptive\n- [ ] Tests are deterministic and independent\n\n## Documentation\n- [ ] README is updated if needed\n- [ ] API documentation is current\n- [ ] Inline comments for complex logic\n- [ ] Change log is updated',
                description: 'Comprehensive checklist for code reviews',
                categoryId: categories[0].id,
                tags: ['code-review', 'quality', 'checklist', 'development'],
                isFavorite: true
            }
        ];

        for (const promptData of prompts) {
            await Prompt.create(promptData);
        }

        console.log('✅ Database seeded successfully!');
        console.log(`Created ${categories.length} categories and ${prompts.length} prompts`);
        
        // Close database connection
        await db.close();

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

// Run seeding if this file is called directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = { seedDatabase };